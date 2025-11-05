import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { ProductoTipo } from '../producto-tipo/entities/producto-tipo.entity';
import { ProductoMarca } from '../producto-marca/entities/producto-marca.entity';
import { Deposito } from 'src/deposito/entities/deposito.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, ProductoTipo, ProductoMarca, Deposito]),
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [TypeOrmModule],
})
export class ProductoModule {}
