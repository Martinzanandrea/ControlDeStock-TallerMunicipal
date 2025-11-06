// interfaces.ts

// ---------- Productos ----------
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
export interface ProductoTipo {
  id: number;
  nombre: string; // backend usa 'nombre'
  estado: 'AC' | 'BA';
}

// ---------- Marcas de Producto ----------
export interface ProductoMarca {
  idProductoMarca: number;
  nombre: string;
  estado: 'AC' | 'BA';
}

// ---------- Depósitos ----------
export interface Deposito {
  idDeposito: number;
  nombre: string;
  ubicacion: string;
  estado: 'AC' | 'BA';
}

// ---------- Stock Ingresado ----------
export interface StockIngresado {
  idStockIngresado: number;
  producto: Producto;        // referencia al producto
  deposito: Deposito;        // referencia al depósito
  cantidad: number;
  fechaIngreso: string;      // ISO string
  estado: 'AC' | 'BA';
}

// ---------- Vehículos ----------
export interface Vehiculo {
  idVehiculo: number;
  dominio: string;
  marca: ProductoMarca;      // referencia a Marca
  modelo: string;
  anio: number;
  estado: 'AC' | 'BA';
}

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
