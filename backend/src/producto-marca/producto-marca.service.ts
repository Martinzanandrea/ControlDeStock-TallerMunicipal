import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoMarca } from './entities/producto-marca.entity';
import { CreateProductoMarcaDto } from './dto/create-producto-marca.dto';
import { UpdateProductoMarcaDto } from './dto/update-producto-marca.dto';

@Injectable()
export class ProductoMarcaService {
  constructor(
    @InjectRepository(ProductoMarca)
    private marcaRepository: Repository<ProductoMarca>,
  ) {}

  async crearMarca(dto: CreateProductoMarcaDto) {
    const marca = this.marcaRepository.create(dto);
    return this.marcaRepository.save(marca);
  }

  async listarMarcas() {
    return this.marcaRepository.find();
  }

  async obtenerPorId(id: number) {
    return this.marcaRepository.findOneBy({ idProductoMarca: id });
  }

  async actualizarMarca(id: number, dto: UpdateProductoMarcaDto) {
    await this.marcaRepository.update(id, dto);
    return this.obtenerPorId(id);
  }

  async eliminarMarca(id: number) {
    return this.marcaRepository.delete(id);
  }
}
