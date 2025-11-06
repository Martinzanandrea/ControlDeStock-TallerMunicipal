import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockEgresoService } from './stock-egreso.service';
import { StockEgresoController } from './stock-egreso.controller';
import { StockEgreso } from './entities/stock-egreso.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Deposito } from '../deposito/entities/deposito.entity';
import { StockIngresado } from '../stock-ingresado/entities/stock-ingresado.entity';
import { Vehiculo } from '../vehiculo/entities/vehiculo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockEgreso,
      Producto,
      Deposito,
      StockIngresado,
      Vehiculo,
    ]),
  ],
  controllers: [StockEgresoController],
  providers: [StockEgresoService],
})
export class StockEgresoModule {}
