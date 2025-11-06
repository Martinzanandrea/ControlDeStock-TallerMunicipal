import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

/**
 * Servicio de Vehículos.
 * Gestiona registro, listado, actualización y baja lógica (estado BA).
 */
@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  /**
   * Registra un nuevo vehículo.
   * @param dto datos del vehículo
   */
  async registrarVehiculo(dto: CreateVehiculoDto): Promise<Vehiculo> {
    const vehiculo = this.vehiculoRepository.create({
      dominio: dto.dominio,
      modelo: dto.modelo,
      anio: dto.anio,
      estado: dto.estado ?? 'AC',
    });

    return await this.vehiculoRepository.save(vehiculo);
  }

  /**
   * Lista vehículos activos ordenados por id.
   */
  async listarVehiculos(): Promise<Vehiculo[]> {
    return await this.vehiculoRepository.find({
      where: { estado: 'AC' },
      order: { idVehiculo: 'ASC' },
    });
  }

  /**
   * Obtiene vehículo por ID.
   */
  async obtenerVehiculoPorId(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { idVehiculo: id },
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    return vehiculo;
  }

  /**
   * Actualiza datos del vehículo.
   */
  async actualizarVehiculo(
    id: number,
    dto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const vehiculo = await this.obtenerVehiculoPorId(id);
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
