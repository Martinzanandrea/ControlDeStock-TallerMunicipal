import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Deposito } from '../../deposito/entities/deposito.entity';

@Entity('stock_ingresado')
export class StockIngresado {
  @PrimaryGeneratedColumn()
  idStockIngresado: number;

  @ManyToOne(() => Producto, {
    eager: true,
  })
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column()
  cantidad: number;

  @ManyToOne(() => Deposito, (deposito) => deposito.stockIngresado, {
    eager: true,
  })
  @JoinColumn({ name: 'idDeposito' })
  deposito: Deposito;

  @Column({ type: 'date' })
  fechaIngreso: string;

  @Column({ default: 'AC' })
  estado: string;
}
