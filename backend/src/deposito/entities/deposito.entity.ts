import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { StockIngresado } from '../../stock-ingresado/entities/stock-ingresado.entity';

@Entity('deposito')
export class Deposito {
  @PrimaryGeneratedColumn()
  idDeposito: number;

  @Column()
  nombre: string;

  @Column()
  ubicacion: string;

  @Column({ length: 2, default: 'AC' }) // AC: Activo, BA: Inactivo
  estado: string;

  @OneToMany(() => StockIngresado, (stock) => stock.deposito)
  stockIngresado: StockIngresado[];
}
