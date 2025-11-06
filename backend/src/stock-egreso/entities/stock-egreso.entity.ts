import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Deposito } from '../../deposito/entities/deposito.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';

@Entity('stock_egreso')
export class StockEgreso {
  @PrimaryGeneratedColumn()
  idStockEgreso: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column()
  cantidad: number;

  @ManyToOne(() => Deposito, { eager: true })
  @JoinColumn({ name: 'idDeposito' })
  deposito: Deposito;

  @ManyToOne(() => Vehiculo, { eager: true, nullable: true })
  @JoinColumn({ name: 'idVehiculo' })
  vehiculo: Vehiculo | null;

  @Column({ type: 'date' })
  fechaEgreso: string;

  @Column({ length: 20, default: 'OFICINA' })
  destinoTipo: string; // 'OFICINA' | 'VEHICULO'

  @Column({ default: 'AC' })
  estado: string;
}
