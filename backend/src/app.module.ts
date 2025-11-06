import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductoModule } from './producto/producto.module';
import { ProductoMarcaModule } from './producto-marca/producto-marca.module';
import { DepositoModule } from './deposito/deposito.module';
import { StockIngresadoModule } from './stock-ingresado/stock-ingresado.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { ProductoTipoModule } from './producto-tipo/producto-tipo.module';
import { StockEgresoModule } from './stock-egreso/stock-egreso.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductoModule,
    ProductoTipoModule,
    ProductoMarcaModule,
    DepositoModule,
    StockIngresadoModule,
    StockEgresoModule,
    VehiculoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
