// frontend/src/api/api.ts
import type {
  Producto,
  ProductoTipo,
  ProductoMarca,
  Deposito,
  Vehiculo,
  StockIngresado,
} from './interface';

const API_URL = 'http://localhost:3000';

// ---------------- Productos ----------------
export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/productos`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function createProducto(data: {
  nombre: string;
  descripcion?: string;
  idMarca: number;
  idTipoProducto: number;
}): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear producto');
  return res.json();
}

export async function updateProducto(
  id: number,
  data: Partial<{ nombre: string; descripcion?: string; idMarca: number; idTipoProducto: number; estado: 'AC' | 'BA' }>
): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  return res.json();
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar producto');
}

// ---------------- ProductosTipos ----------------
export async function getProductosTipos(): Promise<ProductoTipo[]> {
  const res = await fetch(`${API_URL}/productostipos`);
  if (!res.ok) throw new Error('Error al obtener tipos de producto');
  return res.json();
}

export async function createProductoTipo(data: { descripcion: string }): Promise<ProductoTipo> {
  const res = await fetch(`${API_URL}/productostipos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear tipo de producto');
  return res.json();
}

// ---------------- ProductoMarcas ----------------
export async function getProductoMarcas(): Promise<ProductoMarca[]> {
  const res = await fetch(`${API_URL}/productomarca`);
  if (!res.ok) throw new Error('Error al obtener marcas');
  return res.json();
}

export async function createProductoMarca(data: { nombre: string }): Promise<ProductoMarca> {
  const res = await fetch(`${API_URL}/productomarca`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear marca');
  return res.json();
}

// ---------------- Depósitos ----------------
export async function getDepositos(): Promise<Deposito[]> {
  const res = await fetch(`${API_URL}/depositos`);
  if (!res.ok) throw new Error('Error al obtener depósitos');
  return res.json();
}

export async function createDeposito(data: { nombre: string; ubicacion: string }): Promise<Deposito> {
  const res = await fetch(`${API_URL}/depositos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear depósito');
  return res.json();
}

// ---------------- Vehículos ----------------
export async function getVehiculos(): Promise<Vehiculo[]> {
  const res = await fetch(`${API_URL}/vehiculos`);
  if (!res.ok) throw new Error('Error al obtener vehículos');
  return res.json();
}

export async function createVehiculo(data: {
  dominio: string;
  marcaId: number;
  modelo: string;
  anio: number;
}): Promise<Vehiculo> {
  const res = await fetch(`${API_URL}/vehiculos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear vehículo');
  return res.json();
}

// ---------------- StockIngresado ----------------
export async function getStockIngresado(): Promise<StockIngresado[]> {
  const res = await fetch(`${API_URL}/stockingresado`);
  if (!res.ok) throw new Error('Error al obtener stock ingresado');
  return res.json();
}

export async function createStockIngresado(data: {
  idProducto: number;
  idDeposito: number;
  cantidad: number;
  fechaIngreso: string;
  estado: 'AC' | 'BA';
}): Promise<StockIngresado> {
  const res = await fetch(`${API_URL}/stockingresado`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear stock ingresado');
  return res.json();
}
