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

@Controller('/productostipos')
export class ProductoTipoController {
  constructor(private readonly tipoService: ProductoTipoService) {}

  @Post()
  save(@Body() dto: CrearProductoTipoDto) {
    return this.tipoService.crearTipoProducto(dto);
  }

  @Get()
  find() {
    return this.tipoService.listarTiposProducto();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tipoService.buscarTipoPorId(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: ActualizarProductoTipoDto) {
    return this.tipoService.actualizarTipoProducto(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tipoService.eliminarTipoProducto(id);
  }
}
