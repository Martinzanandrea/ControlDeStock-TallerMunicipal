// src/deposito/deposito.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  create(dto: CreateDepositoDto) {
    const nuevo = this.depositoRepo.create(dto);
    return this.depositoRepo.save(nuevo);
  }
  //actualizarlo
  async update(id: number, dto: UpdateDepositoDto) {
    const deposito = await this.findOne(id);
    Object.assign(deposito, dto);
    return this.depositoRepo.save(deposito);
  }
  //eliminarlo
  async remove(id: number) {
    const deposito = await this.findOne(id);
    return this.depositoRepo.remove(deposito);
  }
}
