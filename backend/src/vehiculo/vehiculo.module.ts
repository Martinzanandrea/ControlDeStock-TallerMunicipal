import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { ProductoMarca } from '../producto-marca/entities/producto-marca.entity';
import { ProductoMarcaModule } from '../producto-marca/producto-marca.module';
//prueba
@Module({
  imports: [
    TypeOrmModule.forFeature([Vehiculo, ProductoMarca]),
    ProductoMarcaModule,
  ],
  controllers: [VehiculoController],
  providers: [VehiculoService],
  exports: [TypeOrmModule],
})
export class VehiculoModule {}
//prueba
