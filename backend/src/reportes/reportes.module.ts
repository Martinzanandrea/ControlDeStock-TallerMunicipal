import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Producto } from '../producto/entities/producto.entity';
import { ProductoTipo } from '../producto-tipo/entities/producto-tipo.entity';
import { Deposito } from '../deposito/entities/deposito.entity';
import { StockIngresado } from '../stock-ingresado/entities/stock-ingresado.entity';
import { StockEgreso } from '../stock-egreso/entities/stock-egreso.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';

/**
 * Módulo de reportes.
 * Agrupa entidades necesarias para consultas agregadas
 * y expone el servicio/controlador de reportes.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      ProductoTipo,
      Deposito,
      StockIngresado,
      StockEgreso,
      Vehiculo,
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
