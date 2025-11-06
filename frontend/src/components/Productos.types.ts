import type { Producto, ProductoTipo, ProductoMarca, Deposito } from '../interface';

export interface ProductosState {
  productos: Producto[];
  tipos: ProductoTipo[];
  marcas: ProductoMarca[];
  depositos: Deposito[];
  nuevoProducto: {
    nombre: string;
    descripcion: string;
    tipoId: number;
    marcaId: number;
    depositoId: number;
  };
  nuevaMarca: string;
  nuevoTipo: string;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  };
}
