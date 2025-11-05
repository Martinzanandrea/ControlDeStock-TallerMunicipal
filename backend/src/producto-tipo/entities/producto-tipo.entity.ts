import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity({ name: 'producto_tipos' })
export class ProductoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 2, default: 'AC' })
  estado: string;

  @OneToMany(() => Producto, (producto) => producto.tipo)
  productos: Producto[];
}
