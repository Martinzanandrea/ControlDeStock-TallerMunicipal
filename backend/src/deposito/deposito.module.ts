// src/deposito/deposito.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositoService } from './deposito.service';
import { DepositoController } from './deposito.controller';
import { Deposito } from './entities/deposito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deposito])],
  controllers: [DepositoController],
  providers: [DepositoService],
  exports: [TypeOrmModule],
})
export class DepositoModule {}
