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

/** Controlador para Stock Ingresado */
@Controller('/stockingresado')
export class StockIngresadoController {
  constructor(private readonly stockService: StockIngresadoService) {}

  /** Registra un ingreso de stock */
  @Post()
  crear(@Body() dto: CreateStockIngresadoDto) {
    return this.stockService.crear(dto);
  }

  /** Lista ingresos activos */
  @Get()
  obtenerTodos() {
    return this.stockService.obtenerTodos();
  }

  /** Obtiene un ingreso por ID */
  @Get(':id')
  obtenerPorId(@Param('id') id: number) {
    return this.stockService.obtenerPorId(id);
  }

  /** Actualiza un ingreso */
  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: UpdateStockIngresadoDto) {
    return this.stockService.actualizar(id, dto);
  }

  /** Baja lógica por producto y depósito */
  @Delete('producto/:idProducto/deposito/:idDeposito')
  eliminar(
    @Param('idProducto') idProducto: number,
    @Param('idDeposito') idDeposito: number,
  ) {
    return this.stockService.eliminar(idProducto, idDeposito);
  }
}
