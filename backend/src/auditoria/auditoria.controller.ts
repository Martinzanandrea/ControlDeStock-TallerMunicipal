import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

/** Controlador para consultar logs de auditoría */
@Controller('auditoria')
export class AuditoriaController {
  constructor(
    @InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>,
  ) {}

  /** Lista últimos logs (máx 500) */
  @Get()
  async listar(@Query('limit') limit = '100') {
    const take = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500);
    return this.repo.find({ order: { id: 'DESC' }, take });
  }
}
