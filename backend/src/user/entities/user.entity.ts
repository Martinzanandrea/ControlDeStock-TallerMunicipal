import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuario')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 60 })
  username: string;

  @Column({ length: 200 })
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  nombreCompleto?: string;

  @Column({ type: 'varchar', length: 2, default: 'AC' })
  estado: string; // AC / BA

  @Column({ type: 'text', default: 'USER' })
  roles: string; // Coma separado: ADMIN,USER
}
