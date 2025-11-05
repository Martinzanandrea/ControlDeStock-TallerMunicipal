// src/stock-ingresado/stock-ingresado.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StockIngresadoService } from './stock-ingresado.service';
import { CreateStockIngresadoDto } from './dto/create-stock-ingresado.dto';
import { UpdateStockIngresadoDto } from './dto/update-stock-ingresado.dto';

@Controller('stock-ingresado')
export class StockIngresadoController {
  constructor(private readonly stockService: StockIngresadoService) {}

  @Post()
  crear(@Body() dto: CreateStockIngresadoDto) {
    return this.stockService.crear(dto);
  }

  @Get()
  obtenerTodos() {
    return this.stockService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.stockService.obtenerPorId(id);
  }

  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: UpdateStockIngresadoDto) {
    return this.stockService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.stockService.eliminar(id);
  }
}
