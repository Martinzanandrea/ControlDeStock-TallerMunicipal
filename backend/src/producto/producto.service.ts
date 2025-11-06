import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CrearProductoDto } from './dto/create-producto.dto';
import { ActualizarProductoDto } from './dto/update-producto.dto';
import { ProductoTipo } from 'src/producto-tipo/entities/producto-tipo.entity';
import { ProductoMarca } from 'src/producto-marca/entities/producto-marca.entity';
import { Deposito } from 'src/deposito/entities/deposito.entity';

/**
 * Servicio de productos.
 * Encapsula la lógica de creación, lectura, actualización y borrado lógico.
 * También valida la existencia de tipo, marca y depósito relacionados.
 */
@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(ProductoTipo)
    private readonly tipoRepo: Repository<ProductoTipo>,
    @InjectRepository(ProductoMarca)
    private readonly marcaRepo: Repository<ProductoMarca>,
    @InjectRepository(Deposito)
    private readonly depositoRepo: Repository<Deposito>,
  ) {}

  /**
   * Crea un nuevo producto validando que tipo, marca y depósito existan.
   * @param datos DTO con campos del producto
   * @returns Producto persistido
   */
  async crearProducto(datos: CrearProductoDto): Promise<Producto> {
    const tipo = await this.tipoRepo.findOne({ where: { id: datos.tipoId } });
    const marca = await this.marcaRepo.findOne({
      where: { idProductoMarca: datos.marcaId },
    });
    const deposito = await this.depositoRepo.findOne({
      where: { idDeposito: datos.depositoId },
    });

    if (!tipo || !marca || !deposito) {
      throw new NotFoundException('Tipo, marca o depósito no encontrados');
    }

    const nuevoProducto = this.productoRepo.create({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      tipo,
      marca,
      deposito,

      stockActual: datos.stockActual ?? 0,

      estado: datos.estado,
    });

    return await this.productoRepo.save(nuevoProducto);
  }

  /**
   * Lista productos activos (estado 'AC').
   */
  async listarProductos(): Promise<Producto[]> {
    return await this.productoRepo.find({ where: { estado: 'AC' } });
  }

  /**
   * Busca un producto por su ID. Lanza excepción si no existe.
   * @param id identificador numérico
   */
  async buscarPorId(id: number): Promise<Producto> {
    const producto = await this.productoRepo.findOne({ where: { id } });
    if (!producto)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return producto;
  }

  /**
   * Actualiza campos permitidos del producto.
   * @param id ID del producto
   * @param datos DTO parcial con cambios
   */
  async actualizarProducto(
    id: number,
    datos: ActualizarProductoDto,
  ): Promise<Producto> {
    const producto = await this.buscarPorId(id);
    Object.assign(producto, datos);
    return await this.productoRepo.save(producto);
  }

  /**
   * Realiza borrado lógico (estado -> 'BA').
   * @param id ID del producto
   */
  async eliminarProducto(id: number): Promise<void> {
    const producto = await this.buscarPorId(id);
    // Borrado lógico: solo cambiar estado a 'BA'
    producto.estado = 'BA';
    await this.productoRepo.save(producto);
  }
}
