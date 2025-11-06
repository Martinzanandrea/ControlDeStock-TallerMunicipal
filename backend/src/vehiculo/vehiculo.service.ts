import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ProductoMarca } from '../producto-marca/entities/producto-marca.entity';

/**
 * Servicio de Vehículos.
 * Gestiona registro, listado, actualización y baja lógica (estado BA).
 * Valida la existencia de la marca asociada.
 */
@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,

    @InjectRepository(ProductoMarca)
    private readonly marcaRepository: Repository<ProductoMarca>,
  ) {}

  /**
   * Registra un nuevo vehículo con su marca.
   * @param dto datos del vehículo
   */
  async registrarVehiculo(dto: CreateVehiculoDto): Promise<Vehiculo> {
    const marca = await this.marcaRepository.findOneBy({
      idProductoMarca: dto.idProductoMarca,
    });
    if (!marca) throw new NotFoundException('Marca no encontrada');

    const vehiculo = this.vehiculoRepository.create({
      dominio: dto.dominio,
      modelo: dto.modelo,
      anio: dto.anio,
      estado: dto.estado ?? 'AC',
      marca,
    });

    return await this.vehiculoRepository.save(vehiculo);
  }

  /**
   * Lista vehículos activos ordenados por id.
   */
  async listarVehiculos(): Promise<Vehiculo[]> {
    return await this.vehiculoRepository.find({
      where: { estado: 'AC' },
      relations: ['marca'],
      order: { idVehiculo: 'ASC' },
    });
  }

  /**
   * Obtiene vehículo por ID incluyendo la marca.
   */
  async obtenerVehiculoPorId(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { idVehiculo: id },
      relations: ['marca'],
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    return vehiculo;
  }

  /**
   * Actualiza datos del vehículo y opcionalmente su marca.
   */
  async actualizarVehiculo(
    id: number,
    dto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const vehiculo = await this.obtenerVehiculoPorId(id);
    if (dto.idProductoMarca) {
      const marca = await this.marcaRepository.findOneBy({
        idProductoMarca: dto.idProductoMarca,
      });
      if (!marca) throw new NotFoundException('Marca no encontrada');
      vehiculo.marca = marca;
    }
    Object.assign(vehiculo, dto);
    return await this.vehiculoRepository.save(vehiculo);
  }

  /**
   * Baja lógica del vehículo.
   */
  async eliminarVehiculo(id: number): Promise<void> {
    const vehiculo = await this.obtenerVehiculoPorId(id);
    vehiculo.estado = 'BA';
    await this.vehiculoRepository.save(vehiculo);
  }
}
