import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductoMarcaService } from './producto-marca.service';
import { CreateProductoMarcaDto } from './dto/create-producto-marca.dto';
import { UpdateProductoMarcaDto } from './dto/update-producto-marca.dto';

@Controller('producto-marca')
export class ProductoMarcaController {
  constructor(private readonly productoMarcaService: ProductoMarcaService) {}

  @Post()
  create(@Body() createProductoMarcaDto: CreateProductoMarcaDto) {
    return this.productoMarcaService.crearMarca(createProductoMarcaDto);
  }

  @Get()
  findAll() {
    return this.productoMarcaService.listarMarcas();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoMarcaService.obtenerPorId(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoMarcaDto: UpdateProductoMarcaDto,
  ) {
    return this.productoMarcaService.actualizarMarca(
      +id,
      updateProductoMarcaDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoMarcaService.eliminarMarca(+id);
  }
}
