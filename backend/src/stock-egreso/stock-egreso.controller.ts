import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { StockEgresoService } from './stock-egreso.service';
import { CreateStockEgresoDto } from './dto/create-stock-egreso.dto';
import { UpdateStockEgresoDto } from './dto/update-stock-egreso.dto';

/** Controlador de Stock Egreso */
@Controller('/stockegreso')
export class StockEgresoController {
  constructor(private readonly egresoService: StockEgresoService) {}

  /** Crea un egreso */
  @Post()
  crear(@Body() dto: CreateStockEgresoDto) {
    return this.egresoService.crear(dto);
  }

  /** Lista egresos */
  @Get()
  listar() {
    return this.egresoService.obtenerTodos();
  }

  /** Obtiene egreso por ID */
  @Get(':id')
  obtener(@Param('id') id: number) {
    return this.egresoService.obtenerPorId(id);
  }

  /** Actualiza egreso */
  @Put(':id')
  actualizar(@Param('id') id: number, @Body() dto: UpdateStockEgresoDto) {
    return this.egresoService.actualizar(id, dto);
  }

  /** Baja lógica del egreso */
  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.egresoService.eliminar(id);
  }
}
