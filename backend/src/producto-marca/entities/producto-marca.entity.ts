import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';

/**
 * Entidad ProductoMarca.
 * Representa marcas de productos (no aplica a vehículos).
 */
@Entity('producto_marca')
export class ProductoMarca {
  @PrimaryGeneratedColumn()
  idProductoMarca: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 2, default: 'AC' })
  estado: string; // 'AC' = activo, 'BA' = baja

  // Relación con productos
  @OneToMany(() => Producto, (producto) => producto.marca)
  productos: Producto[];
}
