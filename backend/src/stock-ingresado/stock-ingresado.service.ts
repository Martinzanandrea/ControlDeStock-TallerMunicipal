// src/stock-ingresado/stock-ingresado.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockIngresado } from './entities/stock-ingresado.entity';
import { CreateStockIngresadoDto } from './dto/create-stock-ingresado.dto';
import { UpdateStockIngresadoDto } from './dto/update-stock-ingresado.dto';
import { Producto } from '../producto/entities/producto.entity';
import { Deposito } from '../deposito/entities/deposito.entity';

@Injectable()
export class StockIngresadoService {
  constructor(
    @InjectRepository(StockIngresado)
    private readonly stockRepo: Repository<StockIngresado>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Deposito)
    private readonly depositoRepo: Repository<Deposito>,
  ) {}

  async crear(dto: CreateStockIngresadoDto): Promise<StockIngresado> {
    const producto = await this.productoRepo.findOne({
      where: { id: dto.idProducto },
    });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const deposito = await this.depositoRepo.findOne({
      where: { idDeposito: dto.idDeposito },
    });
    if (!deposito) throw new NotFoundException('Depósito no encontrado');

    // Validación: no permitir fecha futura
    const fechaIngresoDate = new Date(dto.fechaIngreso);
    const now = new Date();
    if (isNaN(fechaIngresoDate.getTime())) {
      throw new BadRequestException('fechaIngreso inválida');
    }
    if (fechaIngresoDate.getTime() > now.getTime()) {
      throw new BadRequestException('No se permiten fechas de ingreso futuras');
    }

    const nuevo = this.stockRepo.create({
      producto,
      deposito,
      cantidad: dto.cantidad,
      fechaIngreso: dto.fechaIngreso,
      estado: dto.estado,
    });

    return this.stockRepo.save(nuevo);
  }

  async obtenerTodos(): Promise<StockIngresado[]> {
    return this.stockRepo.find();
  }

  async obtenerPorId(id: number): Promise<StockIngresado> {
    const stock = await this.stockRepo.findOne({
      where: { idStockIngresado: id },
    });
    if (!stock) throw new NotFoundException('Registro de stock no encontrado');
    return stock;
  }

  async actualizar(
    id: number,
    dto: UpdateStockIngresadoDto,
  ): Promise<StockIngresado> {
    const stock = await this.obtenerPorId(id);
    Object.assign(stock, dto);
    return this.stockRepo.save(stock);
  }

  async eliminar(idProducto: number, idDeposito: number): Promise<void> {
    const stock = await this.stockRepo.findOne({
      where: {
        producto: { id: idProducto },
        deposito: { idDeposito: idDeposito },
      },
    });

    if (!stock) {
      throw new NotFoundException('Stock no encontrado');
    }

    await this.stockRepo.remove(stock);
  }
}
