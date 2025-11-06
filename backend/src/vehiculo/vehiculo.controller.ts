import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

/**
 * Controlador HTTP de Vehículos.
 */
@Controller('vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  /** Crea un vehículo */
  @Post()
  crearVehiculo(@Body() dto: CreateVehiculoDto) {
    return this.vehiculoService.registrarVehiculo(dto);
  }

  /** Lista vehículos activos */
  @Get()
  listarVehiculos() {
    return this.vehiculoService.listarVehiculos();
  }

  /** Obtiene un vehículo por ID */
  @Get(':id')
  obtenerVehiculo(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculoService.obtenerVehiculoPorId(id);
  }

  /** Actualiza datos del vehículo */
  @Put(':id')
  actualizarVehiculo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.actualizarVehiculo(id, dto);
  }

  /** Baja lógica del vehículo */
  @Delete(':id')
  eliminarVehiculo(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculoService.eliminarVehiculo(id);
  }
}
