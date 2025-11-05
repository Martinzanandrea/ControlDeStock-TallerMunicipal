import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoMarca } from './entities/producto-marca.entity';
import { ProductoMarcaService } from './producto-marca.service';
import { ProductoMarcaController } from './producto-marca.controller';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoMarca, Vehiculo])],
  controllers: [ProductoMarcaController],
  providers: [ProductoMarcaService],
  exports: [TypeOrmModule], // 👈 esto permite que otros módulos usen la entidad
})
export class ProductoMarcaModule {}
