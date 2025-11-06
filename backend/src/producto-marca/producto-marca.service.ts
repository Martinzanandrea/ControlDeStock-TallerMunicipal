import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoMarca } from './entities/producto-marca.entity';
import { CreateProductoMarcaDto } from './dto/create-producto-marca.dto';
import { UpdateProductoMarcaDto } from './dto/update-producto-marca.dto';

/** Servicio de Marcas de Producto */
@Injectable()
export class ProductoMarcaService {
  constructor(
    @InjectRepository(ProductoMarca)
    private marcaRepository: Repository<ProductoMarca>,
  ) {}

  /** Crea una marca */
  async crearMarca(dto: CreateProductoMarcaDto) {
    const marca = this.marcaRepository.create(dto);
    return this.marcaRepository.save(marca);
  }

  /** Lista marcas activas */
  async listarMarcas() {
    return this.marcaRepository.find({ where: { estado: 'AC' } });
  }

  /** Obtiene marca por ID */
  async obtenerPorId(id: number) {
    return this.marcaRepository.findOneBy({ idProductoMarca: id });
  }

  /** Actualiza una marca */
  async actualizarMarca(id: number, dto: UpdateProductoMarcaDto) {
    await this.marcaRepository.update(id, dto);
    return this.obtenerPorId(id);
  }

  /** Baja lógica de marca */
  async eliminarMarca(id: number) {
    const marca = await this.marcaRepository.findOneBy({ idProductoMarca: id });
    if (!marca) return;
    marca.estado = 'BA';
    await this.marcaRepository.save(marca);
    return { message: 'Marca dada de baja' };
  }
}
