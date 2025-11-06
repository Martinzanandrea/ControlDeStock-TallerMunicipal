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

/** Controlador para Marcas de Producto */
@Controller('/productomarca')
export class ProductoMarcaController {
  constructor(private readonly productoMarcaService: ProductoMarcaService) {}

  /** Crea una marca */
  @Post()
  create(@Body() createProductoMarcaDto: CreateProductoMarcaDto) {
    return this.productoMarcaService.crearMarca(createProductoMarcaDto);
  }

  /** Lista marcas */
  @Get()
  findAll() {
    return this.productoMarcaService.listarMarcas();
  }

  /** Obtiene marca por ID */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoMarcaService.obtenerPorId(+id);
  }

  /** Actualiza marca */
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

  /** Baja lógica de marca */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoMarcaService.eliminarMarca(+id);
  }
}
