// Definiciones de interfaces que el frontend consume del backend
// Mantienen el mismo shape que envía NestJS/TypeORM en las respuestas.

// ---------- Productos ----------
/** Producto con relaciones de tipo y marca, y stock consolidado */
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo: ProductoTipo; // relación con ProductoTipo (backend usa 'tipo')
  marca: ProductoMarca; // relación con ProductoMarca (backend usa 'marca')
  deposito?: Deposito;
  stockActual: number;
  estado: 'AC' | 'BA';
}

// ---------- Tipos de Producto ----------
/** Catálogo de tipos de producto */
export interface ProductoTipo {
  id: number;
  nombre: string; // backend usa 'nombre'
  estado: 'AC' | 'BA';
}

// ---------- Marcas de Producto ----------
/** Catálogo de marcas de producto */
export interface ProductoMarca {
  idProductoMarca: number;
  nombre: string;
  estado: 'AC' | 'BA';
}

// ---------- Depósitos ----------
/** Depósito físico donde se almacena stock */
export interface Deposito {
  idDeposito: number;
  nombre: string;
  ubicacion: string;
  estado: 'AC' | 'BA';
}

// ---------- Stock Ingresado ----------
/** Movimiento de ingreso de stock a un depósito */
export interface StockIngresado {
  idStockIngresado: number;
  producto: Producto;        // referencia al producto
  deposito: Deposito;        // referencia al depósito
  cantidad: number;
  fechaIngreso: string;      // ISO string
  estado: 'AC' | 'BA';
}

// ---------- Vehículos ----------
/** Vehículo destinatario de egresos cuando destinoTipo='VEHICULO' */
export interface Vehiculo {
  idVehiculo: number;
  dominio: string;
  marca: ProductoMarca;      // referencia a Marca
  modelo: string;
  anio: number;
  estado: 'AC' | 'BA';
}

/** Movimiento de egreso desde un depósito hacia oficina o vehículo */
export interface StockEgreso {
  idStockEgreso: number;
  producto: Producto;
  deposito: Deposito;
  cantidad: number;
  fechaEgreso: string;
  destinoTipo: 'OFICINA' | 'VEHICULO';
  vehiculo?: Vehiculo | null;
  estado: 'AC' | 'BA';
}
