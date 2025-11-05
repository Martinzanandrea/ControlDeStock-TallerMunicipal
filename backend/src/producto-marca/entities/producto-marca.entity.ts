import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';

@Entity('producto_marca')
export class ProductoMarca {
  @PrimaryGeneratedColumn()
  idProductoMarca: number; // 👈 bien, consistente con tu convención

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 2, default: 'AC' })
  estado: string; // 'AC' = activo, 'BA' = baja

  // Relación con productos
  @OneToMany(() => Producto, (producto) => producto.marca)
  productos: Producto[];

  // Relación con vehículos (si las marcas también aplican a vehículos)
  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.marca)
  vehiculos: Vehiculo[];
}
