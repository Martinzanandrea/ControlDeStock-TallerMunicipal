// src/deposito/deposito.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DepositoService } from './deposito.service';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';

/**
 * Controlador HTTP para depósitos.
 * Expone endpoints CRUD con baja lógica.
 */
@Controller('/depositos')
export class DepositoController {
  constructor(private readonly depositoService: DepositoService) {}

  /** Lista todos los depósitos activos */
  @Get()
  getAll() {
    return this.depositoService.findAll();
  }

  /** Obtiene un depósito por ID */
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.depositoService.findOne(id);
  }

  /** Crea un nuevo depósito */
  @Post()
  create(@Body() dto: CreateDepositoDto) {
    return this.depositoService.create(dto);
  }

  /** Actualiza campos del depósito */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepositoDto,
  ) {
    return this.depositoService.update(id, dto);
  }

  /** Realiza baja lógica del depósito */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.depositoService.remove(id);
  }
}
