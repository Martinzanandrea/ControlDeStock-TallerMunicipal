import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoMarca } from '../../producto-marca/entities/producto-marca.entity';

@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  idVehiculo: number;

  @Column({ length: 10 })
  dominio: string;

  @ManyToOne(() => ProductoMarca, (marca) => marca.vehiculos)
  @JoinColumn({ name: 'idProductoMarca' })
  marca: ProductoMarca;

  @Column({ length: 100 })
  modelo: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ length: 2, default: 'AC' })
  estado: string;
}
