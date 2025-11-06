import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockEgreso } from './entities/stock-egreso.entity';
import { CreateStockEgresoDto } from './dto/create-stock-egreso.dto';
import { UpdateStockEgresoDto } from './dto/update-stock-egreso.dto';
import { Producto } from '../producto/entities/producto.entity';
import { Deposito } from '../deposito/entities/deposito.entity';
import { StockIngresado } from '../stock-ingresado/entities/stock-ingresado.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';

@Injectable()
export class StockEgresoService {
  constructor(
    @InjectRepository(StockEgreso)
    private readonly egresoRepo: Repository<StockEgreso>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Deposito)
    private readonly depositoRepo: Repository<Deposito>,

    @InjectRepository(StockIngresado)
    private readonly ingresoRepo: Repository<StockIngresado>,

    @InjectRepository(Vehiculo)
    private readonly vehiculoRepo: Repository<Vehiculo>,
  ) {}

  async crear(dto: CreateStockEgresoDto): Promise<StockEgreso> {
    const producto = await this.productoRepo.findOne({
      where: { id: dto.idProducto },
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const deposito = await this.depositoRepo.findOne({
      where: { idDeposito: dto.idDeposito },
    });
    if (!deposito) throw new NotFoundException('Depósito no encontrado');

    let vehiculo: Vehiculo | null = null;
    if (dto.destinoTipo === 'VEHICULO') {
      if (!dto.idVehiculo)
        throw new BadRequestException(
          'idVehiculo requerido para destino VEHICULO',
        );
      vehiculo = await this.vehiculoRepo.findOne({
        where: { idVehiculo: dto.idVehiculo },
      });
      if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    }

    // Validación fecha no futura
    const fechaEgreso = new Date(dto.fechaEgreso);
    const now = new Date();
    if (isNaN(fechaEgreso.getTime()))
      throw new BadRequestException('fechaEgreso inválida');
    if (fechaEgreso.getTime() > now.getTime())
      throw new BadRequestException('No se permiten fechas de egreso futuras');

    // Calcular stock disponible en el depósito para ese producto
    const ingresos = await this.ingresoRepo.find({
      where: {
        producto: { id: producto.id },
        deposito: { idDeposito: deposito.idDeposito },
      },
    });
    const totalIngresado = ingresos.reduce((s, x) => s + (x.cantidad ?? 0), 0);

    const egresos = await this.egresoRepo.find({
      where: {
        producto: { id: producto.id },
        deposito: { idDeposito: deposito.idDeposito },
      },
    });
    const totalEgresado = egresos.reduce((s, x) => s + (x.cantidad ?? 0), 0);

    const disponible = totalIngresado - totalEgresado;
    if (dto.cantidad > disponible)
      throw new BadRequestException(
        'Cantidad solicitada supera stock disponible en depósito',
      );

    const nuevo = this.egresoRepo.create({
      producto,
      deposito,
      vehiculo: vehiculo ?? null,
      cantidad: dto.cantidad,
      fechaEgreso: dto.fechaEgreso,
      destinoTipo: dto.destinoTipo,
      estado: 'AC',
    });

    return this.egresoRepo.save(nuevo);
  }

  async obtenerTodos(): Promise<StockEgreso[]> {
    return this.egresoRepo.find();
  }

  async obtenerPorId(id: number): Promise<StockEgreso> {
    const egreso = await this.egresoRepo.findOne({
      where: { idStockEgreso: id },
    });
    if (!egreso) throw new NotFoundException('Egreso no encontrado');
    return egreso;
  }

  async actualizar(
    id: number,
    dto: UpdateStockEgresoDto,
  ): Promise<StockEgreso> {
    const egreso = await this.obtenerPorId(id);
    Object.assign(egreso, dto);
    return this.egresoRepo.save(egreso);
  }

  async eliminar(id: number): Promise<void> {
    const egreso = await this.obtenerPorId(id);
    await this.egresoRepo.remove(egreso);
  }
}
