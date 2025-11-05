// src/stock-ingresado/stock-ingresado.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockIngresadoService } from './stock-ingresado.service';
import { StockIngresadoController } from './stock-ingresado.controller';
import { StockIngresado } from './entities/stock-ingresado.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Deposito } from '../deposito/entities/deposito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockIngresado, Producto, Deposito])],
  controllers: [StockIngresadoController],
  providers: [StockIngresadoService],
  exports: [StockIngresadoService],
})
export class StockIngresadoModule {}
