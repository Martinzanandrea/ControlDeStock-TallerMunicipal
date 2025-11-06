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
import { ReportesModule } from './reportes/reportes.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { AuditInterceptor } from './auditoria/audit.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

/**
 * Módulo raíz que ensambla todos los módulos del dominio.
 * Configura TypeORM, carga variables de entorno y aplica guard e interceptor globales.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    // Configuración de conexión a la base de datos PostgreSQL via TypeORM.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: ['error'],
      retryAttempts: 5,
      retryDelay: 3000,
    }),
    ProductoModule,
    ProductoTipoModule,
    ProductoMarcaModule,
    DepositoModule,
    StockIngresadoModule,
    StockEgresoModule,
    ReportesModule,
    UserModule,
    AuthModule,
    VehiculoModule,
    AuditoriaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // Guard global JWT para proteger endpoints (excepto los marcados con @Public()).
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      // Interceptor global de auditoría: registra acciones de cada request autenticada.
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
