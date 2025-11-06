import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';

/**
 * Módulo de Vehículos.
 * Proporciona entidad, controlador y servicio para gestionar vehículos sin relación con marcas de productos.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo])],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [TypeOrmModule],
})
export class VehiculoModule {}
