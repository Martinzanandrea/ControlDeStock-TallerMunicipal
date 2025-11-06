import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/create-producto.dto';
import { ActualizarProductoDto } from './dto/update-producto.dto';

/**
 * Controlador REST para productos.
 * Expone operaciones CRUD con borrado lógico.
 */
@Controller('/productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  /**
   * Crea un producto nuevo.
   * @param dto datos de creación
   */
  @Post()
  crear(@Body() dto: CrearProductoDto) {
    return this.productoService.crearProducto(dto);
  }

  /**
   * Lista productos activos.
   */
  @Get()
  listar() {
    return this.productoService.listarProductos();
  }

  /**
   * Busca producto por ID.
   * @param id identificador
   */
  @Get(':id')
  buscar(@Param('id') id: number) {
    return this.productoService.buscarPorId(id);
  }

  /**
   * Actualiza un producto existente.
   * @param id identificador
   * @param dto cambios parciales
   */
  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: ActualizarProductoDto) {
    return this.productoService.actualizarProducto(id, dto);
  }

  /**
   * Realiza borrado lógico de un producto.
   * @param id identificador
   */
  @Delete(':id')
  async eliminar(@Param('id') id: number) {
    try {
      await this.productoService.eliminarProducto(id);
      return { message: 'Producto eliminado exitosamente' };
    } catch (error: unknown) {
      let msg = 'No se pudo eliminar el producto';
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        msg = (error as { message: string }).message;
      }
      throw new BadRequestException(msg);
    }
  }
}
