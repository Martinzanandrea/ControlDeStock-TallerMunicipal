import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CrearProductoDto } from './dto/create-producto.dto';
import { ActualizarProductoDto } from './dto/update-producto.dto';

@Controller('/productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  crear(@Body() dto: CrearProductoDto) {
    return this.productoService.crearProducto(dto);
  }

  @Get()
  listar() {
    return this.productoService.listarProductos();
  }

  @Get(':id')
  buscar(@Param('id') id: number) {
    return this.productoService.buscarPorId(id);
  }

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: ActualizarProductoDto) {
    return this.productoService.actualizarProducto(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.productoService.eliminarProducto(id);
  }
}
