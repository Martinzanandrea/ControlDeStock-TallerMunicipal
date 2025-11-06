import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * Entidad Vehículo.
 * Representa un vehículo destino de egresos (sin relación con marcas de productos).
 */
@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  idVehiculo: number;

  @Column({ length: 10, unique: true })
  dominio: string;

  @Column({ length: 100 })
  modelo: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ length: 2, default: 'AC' })
  estado: string;
}
