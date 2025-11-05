// interfaces.ts

// ---------- Productos ----------
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  tipoProducto: ProductoTipo; // relación con ProductoTipo
  marca: ProductoMarca;       // relación con ProductoMarca
  estado: 'AC' | 'BA';
}

// ---------- Tipos de Producto ----------
export interface ProductoTipo {
  idProductoTipo: number;
  descripcion: string;
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
  año: number;
  estado: 'AC' | 'BA';
}
