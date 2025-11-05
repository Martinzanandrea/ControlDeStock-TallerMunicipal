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

@Controller('vehiculos')
export class VehiculoController {
  constructor(private readonly vehiculoService: VehiculoService) {}

  @Post()
  crearVehiculo(@Body() dto: CreateVehiculoDto) {
    return this.vehiculoService.registrarVehiculo(dto);
  }

  @Get()
  listarVehiculos() {
    return this.vehiculoService.listarVehiculos();
  }

  @Get(':id')
  obtenerVehiculo(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculoService.obtenerVehiculoPorId(id);
  }

  @Put(':id')
  actualizarVehiculo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehiculoDto,
  ) {
    return this.vehiculoService.actualizarVehiculo(id, dto);
  }

  @Delete(':id')
  eliminarVehiculo(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculoService.eliminarVehiculo(id);
  }
}
