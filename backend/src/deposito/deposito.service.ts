// src/deposito/deposito.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Deposito } from './entities/deposito.entity';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';

@Injectable()
export class DepositoService {
  constructor(
    @InjectRepository(Deposito)
    private depositoRepo: Repository<Deposito>,
  ) {}
  //listar todos
  findAll() {
    return this.depositoRepo.find();
  }
  //encontrar por id
  async findOne(id: number) {
    const deposito = await this.depositoRepo.findOne({
      where: { idDeposito: id },
    });
    if (!deposito) throw new NotFoundException('Depósito no encontrado');
    return deposito;
  }
  //crear depósito
  async create(dto: CreateDepositoDto) {
    // Verificar si ya existe un depósito con el mismo nombre
    const existente = await this.depositoRepo.findOne({
      where: { nombre: dto.nombre },
    });

    if (existente) {
      throw new Error('Ya existe un depósito con este nombre');
    }

    const nuevo = this.depositoRepo.create(dto);
    return this.depositoRepo.save(nuevo);
  }
  //actualizarlo
  async update(id: number, dto: UpdateDepositoDto) {
    const deposito = await this.findOne(id);

    if (dto.nombre) {
      // Verificar si ya existe otro depósito con el mismo nombre
      const existente = await this.depositoRepo.findOne({
        where: {
          nombre: dto.nombre,
          idDeposito: Not(id), // excluir el depósito actual
        },
      });

      if (existente) {
        throw new Error('Ya existe otro depósito con este nombre');
      }
    }

    Object.assign(deposito, dto);
    return this.depositoRepo.save(deposito);
  }
  //eliminarlo
  async remove(id: number) {
    const deposito = await this.findOne(id);
    return this.depositoRepo.remove(deposito);
  }
}
