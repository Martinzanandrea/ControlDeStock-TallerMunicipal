import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoTipoService } from './producto-tipo.service';
import { ProductoTipoController } from './producto-tipo.controller';
import { ProductoTipo } from 'src/producto-tipo/entities/producto-tipo.entity';
import { ProductoMarca } from 'src/producto-marca/entities/producto-marca.entity';
import { DepositoModule } from 'src/deposito/deposito.module';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, ProductoTipo, ProductoMarca]),
    DepositoModule,
    ProductoMarca,
    ProductoTipo, // ✅ esto habilita el DepositoRepository
  ],
  controllers: [ProductoTipoController],
  providers: [ProductoTipoService],
  exports: [TypeOrmModule],
})
export class ProductoTipoModule {}
