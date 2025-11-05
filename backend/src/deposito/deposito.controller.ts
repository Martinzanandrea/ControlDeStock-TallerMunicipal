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

@Controller('/depositos')
export class DepositoController {
  constructor(private readonly depositoService: DepositoService) {}

  @Get()
  getAll() {
    return this.depositoService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.depositoService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDepositoDto) {
    return this.depositoService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepositoDto,
  ) {
    return this.depositoService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.depositoService.remove(id);
  }
}
