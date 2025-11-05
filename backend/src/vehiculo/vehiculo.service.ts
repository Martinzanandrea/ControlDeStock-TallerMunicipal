import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ProductoMarca } from '../producto-marca/entities/producto-marca.entity';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,

    @InjectRepository(ProductoMarca)
    private readonly marcaRepository: Repository<ProductoMarca>,
  ) {}

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

  async listarVehiculos(): Promise<Vehiculo[]> {
    return await this.vehiculoRepository.find({
      relations: ['marca'],
      order: { idVehiculo: 'ASC' },
    });
  }

  async obtenerVehiculoPorId(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { idVehiculo: id },
      relations: ['marca'],
    });
    if (!vehiculo) throw new NotFoundException('Vehículo no encontrado');
    return vehiculo;
  }

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

  async eliminarVehiculo(id: number): Promise<void> {
    const vehiculo = await this.obtenerVehiculoPorId(id);
    await this.vehiculoRepository.remove(vehiculo);
  }
}
