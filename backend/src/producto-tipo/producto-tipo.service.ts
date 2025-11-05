import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoTipo } from './entities/producto-tipo.entity';
import { CrearProductoTipoDto } from './dto/create-producto-tipo.dto';
import { ActualizarProductoTipoDto } from './dto/update-producto-tipo.dto';

@Injectable()
export class ProductoTipoService {
  constructor(
    @InjectRepository(ProductoTipo)
    private readonly tipoRepo: Repository<ProductoTipo>,
  ) {}

  async crearTipoProducto(dto: CrearProductoTipoDto): Promise<ProductoTipo> {
    const nuevoTipo = this.tipoRepo.create(dto);
    return await this.tipoRepo.save(nuevoTipo);
  }

  async listarTiposProducto(): Promise<ProductoTipo[]> {
    return await this.tipoRepo.find();
  }

  async buscarTipoPorId(id: number): Promise<ProductoTipo> {
    const tipo = await this.tipoRepo.findOne({ where: { id } });
    if (!tipo)
      throw new NotFoundException(
        `Tipo de producto con ID ${id} no encontrado`,
      );
    return tipo;
  }

  async actualizarTipoProducto(
    id: number,
    dto: ActualizarProductoTipoDto,
  ): Promise<ProductoTipo> {
    const tipo = await this.buscarTipoPorId(id);
    Object.assign(tipo, dto);
    return await this.tipoRepo.update(tipo.id, tipo).then(() => tipo);
  }

  async eliminarTipoProducto(id: number): Promise<void> {
    const tipo = await this.buscarTipoPorId(id);
    await this.tipoRepo.remove(tipo);
  }
}
