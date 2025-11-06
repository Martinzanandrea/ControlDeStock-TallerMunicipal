import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'auditoria' })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  @Index()
  userId: number | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', length: 10 })
  method: string; // GET, POST, PUT, DELETE

  @Column({ type: 'varchar', length: 20 })
  action: string; // READ, CREATE, UPDATE, DELETE

  @Column({ type: 'varchar', length: 200 })
  route: string; // e.g. /productos/:id

  @Column({ type: 'varchar', length: 100, nullable: true })
  resource: string | null; // e.g. productos

  @Column({ type: 'varchar', length: 50, nullable: true })
  entityId: string | null; // id param si aplica

  @Column({ type: 'jsonb', nullable: true })
  params: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  query: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  body: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
