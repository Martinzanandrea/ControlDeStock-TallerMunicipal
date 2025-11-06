import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

export interface AuditPayload {
  userId?: number | null;
  username?: string | null;
  method: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';
  route: string;
  resource?: string | null;
  entityId?: string | null;
  params?: Record<string, unknown> | null;
  query?: Record<string, unknown> | null;
  body?: Record<string, unknown> | null;
}

/** Servicio que persiste registros de auditoría */
@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  /** Inserta un log de auditoría */
  async log(data: AuditPayload): Promise<void> {
    const entry = this.repo.create({
      userId: data.userId ?? null,
      username: data.username ?? null,
      method: data.method,
      action: data.action,
      route: data.route,
      resource: data.resource ?? null,
      entityId: data.entityId ?? null,
      params: data.params ?? null,
      query: data.query ?? null,
      body: data.body ?? null,
    });
    await this.repo.save(entry);
  }
}
