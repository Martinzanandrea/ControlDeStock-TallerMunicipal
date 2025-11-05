import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoTipo } from 'src/producto-tipo/entities/producto-tipo.entity';
import { ProductoMarca } from 'src/producto-marca/entities/producto-marca.entity';
import { Deposito } from 'src/deposito/entities/deposito.entity';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @ManyToOne(() => ProductoTipo, { eager: true })
  @JoinColumn({ name: 'idTipo' })
  tipo: ProductoTipo;

  @ManyToOne(() => ProductoMarca, { eager: true })
  @JoinColumn({ name: 'idMarca' })
  marca: ProductoMarca;

  @ManyToOne(() => Deposito, { eager: true })
  @JoinColumn({ name: 'idDeposito' })
  deposito: Deposito;

  @Column('int', { default: 0 })
  stockActual: number;

  @Column({ type: 'varchar', length: 2, default: 'AC' })
  estado: string;
}
