import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductoTipoService } from './producto-tipo.service';
import { CrearProductoTipoDto } from './dto/create-producto-tipo.dto';
import { ActualizarProductoTipoDto } from './dto/update-producto-tipo.dto';

/** Controlador para Tipos de Producto */
@Controller('/productostipos')
export class ProductoTipoController {
  constructor(private readonly tipoService: ProductoTipoService) {}

  /** Crea un tipo */
  @Post()
  save(@Body() dto: CrearProductoTipoDto) {
    return this.tipoService.crearTipoProducto(dto);
  }

  /** Lista tipos */
  @Get()
  find() {
    return this.tipoService.listarTiposProducto();
  }

  /** Obtiene tipo por ID */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tipoService.buscarTipoPorId(id);
  }

  /** Actualiza tipo */
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: ActualizarProductoTipoDto) {
    return this.tipoService.actualizarTipoProducto(id, dto);
  }

  /** Baja lógica de tipo */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tipoService.eliminarTipoProducto(id);
  }
}
