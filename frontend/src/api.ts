// Helpers de API del frontend
// Centraliza llamadas fetch al backend, incluyendo headers con JWT y
// utilidades para descargar Excel/PDF. Mantengo las firmas simples
// para usarlas directo desde los componentes.
import type {
  Producto,
  ProductoTipo,
  ProductoMarca,
  Deposito,
  Vehiculo,
  StockIngresado,
} from './interface';

import { getToken } from './auth';
// URL base del backend (configurable por Vite vía VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Agrega Authorization: Bearer <token> si existe sesión
function authHeaders(extra: Record<string, string> = {}) {
  const token = getToken();
  return token
    ? { ...extra, Authorization: `Bearer ${token}` }
    : extra;
}

// ---------- Descarga de reportes (con Authorization) ----------
// Descarga binaria (blob) y fuerza guardado local con un <a> temporal
async function download(path: string, filename: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al descargar archivo');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export const reportes = {
  stockPorTipoExcel: () => download('/reportes/stock/tipo.xlsx', 'stock_por_tipo.xlsx'),
  stockPorTipoPdf: () => download('/reportes/stock/tipo.pdf', 'stock_por_tipo.pdf'),
  stockPorDepositoExcel: () => download('/reportes/stock/deposito.xlsx', 'stock_por_deposito.xlsx'),
  stockPorDepositoPdf: () => download('/reportes/stock/deposito.pdf', 'stock_por_deposito.pdf'),
  historialProductoExcel: (idProducto: number) => download(`/reportes/historial/producto/${idProducto}.xlsx`, `historial_producto_${idProducto}.xlsx`),
  historialProductoPdf: (idProducto: number) => download(`/reportes/historial/producto/${idProducto}.pdf`, `historial_producto_${idProducto}.pdf`),
  historialDestinoExcel: (params: { destinoTipo?: string; idVehiculo?: number }) => {
    const q = new URLSearchParams();
    if (params.destinoTipo) q.set('destinoTipo', params.destinoTipo);
    if (params.idVehiculo) q.set('idVehiculo', String(params.idVehiculo));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return download(`/reportes/historial/destino.xlsx${qs}`, 'historial_destino.xlsx');
  },
  historialDestinoPdf: (params: { destinoTipo?: string; idVehiculo?: number }) => {
    const q = new URLSearchParams();
    if (params.destinoTipo) q.set('destinoTipo', params.destinoTipo);
    if (params.idVehiculo) q.set('idVehiculo', String(params.idVehiculo));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return download(`/reportes/historial/destino.pdf${qs}`, 'historial_destino.pdf');
  },
};

// ---------------- Productos ----------------
// ---------- Productos ----------
export async function getProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_URL}/productos`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function createProducto(data: {
  nombre: string;
  descripcion?: string;
  tipoId: number;
  marcaId: number;
  depositoId: number;
  estado?: 'AC' | 'BA';
}): Promise<Producto> {
  const payload = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    tipoId: data.tipoId,
    marcaId: data.marcaId,
    depositoId: data.depositoId,
    estado: data.estado ?? 'AC',
  };
  const res = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear producto');
  }
  return res.json();
}

export async function updateProducto(
  id: number,
  data: Partial<{ nombre: string; descripcion?: string; idMarca: number; idTipoProducto: number; estado: 'AC' | 'BA' }>
): Promise<Producto> {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar producto');
  return res.json();
}

export async function deleteProducto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Error al eliminar producto');
}

// ---------- Tipos de Producto ----------
export async function getProductosTipos(): Promise<ProductoTipo[]> {
  const res = await fetch(`${API_URL}/productostipos`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener tipos de producto');
  return res.json();
}

export async function createProductoTipo(data: { nombre: string }): Promise<ProductoTipo> {
  const payload = { nombre: data.nombre, estado: 'AC' };
  const res = await fetch(`${API_URL}/productostipos`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear tipo de producto');
  }
  return res.json();
}

// ---------- Marcas de Producto ----------
export async function getProductoMarcas(): Promise<ProductoMarca[]> {
  const res = await fetch(`${API_URL}/productomarca`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener marcas');
  return res.json();
}

export async function createProductoMarca(data: { nombre: string }): Promise<ProductoMarca> {
  const res = await fetch(`${API_URL}/productomarca`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear marca');
  }
  return res.json();
}

// ---------- Depósitos ----------
export async function getDepositos(): Promise<Deposito[]> {
  const res = await fetch(`${API_URL}/depositos`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener depósitos');
  return res.json();
}

export async function createDeposito(data: { nombre: string; ubicacion: string }): Promise<Deposito> {
  const res = await fetch(`${API_URL}/depositos`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear depósito');
  }
  return res.json();
}

// ---------- Vehículos ----------
export async function getVehiculos(): Promise<Vehiculo[]> {
  const res = await fetch(`${API_URL}/vehiculos`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener vehículos');
  return res.json();
}

/**
 * Crea un nuevo vehículo (solo dominio, modelo y año).
 */
export async function createVehiculo(data: {
  dominio: string;
  modelo: string;
  anio: number;
}): Promise<Vehiculo> {
  const payload = {
    dominio: data.dominio,
    modelo: data.modelo,
    anio: data.anio,
  };
  const res = await fetch(`${API_URL}/vehiculos`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear vehículo');
  }
  return res.json();
}

export async function deleteVehiculo(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/vehiculos/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al eliminar vehículo');
  }
}

// ---------- Stock Ingresado ----------
export async function getStockIngresado(): Promise<StockIngresado[]> {
  const res = await fetch(`${API_URL}/stockingresado`, { headers: authHeaders() });
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
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear stock ingresado');
  }
  return res.json();
}

export async function deleteStockIngresado(idProducto: number, idDeposito: number): Promise<void> {
  const res = await fetch(`${API_URL}/stockingresado/producto/${idProducto}/deposito/${idDeposito}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al eliminar el stock');
  }
}

// ---------- Stock Egresos ----------
import type { StockEgreso } from './interface';

export async function getStockEgresos(): Promise<StockEgreso[]> {
  const res = await fetch(`${API_URL}/stockegreso`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Error al obtener egresos');
  return res.json();
}

export async function createStockEgreso(data: {
  idProducto: number;
  idDeposito: number;
  cantidad: number;
  fechaEgreso: string;
  destinoTipo: 'OFICINA' | 'VEHICULO';
  idVehiculo?: number;
}): Promise<StockEgreso> {
  const res = await fetch(`${API_URL}/stockegreso`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Error al crear egreso');
  }
  return res.json();
}

export async function deleteStockEgreso(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/stockegreso/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) throw new Error('Error al eliminar egreso');
}

// ---------- Reportes ----------
/**
 * Interfaz para movimientos del historial de un producto.
 */
export interface MovimientoProducto {
  tipo: 'INGRESO' | 'EGRESO';
  fecha: string;
  cantidad: number;
  deposito?: string;
  destinoTipo?: string;
  vehiculo?: string;
}

/**
 * Interfaz para el stock por producto y depósito.
 */
export interface StockProductoDeposito {
  producto: string;
  deposito: string;
  stock: number;
}

/**
 * Descarga un archivo (Excel o PDF) con autenticación.
 * Maneja el blob y crea un link temporal para la descarga.
 */
async function descargarArchivo(url: string, nombreArchivo: string): Promise<void> {
  const response = await fetch(url, {
    headers: authHeaders()
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al descargar el archivo');
  }
  
  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = nombreArchivo;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Dar tiempo para que se inicie la descarga antes de limpiar
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }, 100);
}

/**
 * Obtiene el historial de movimientos (ingresos y egresos) de un producto.
 */
export async function getHistorialProducto(idProducto: number): Promise<MovimientoProducto[]> {
  const res = await fetch(`${API_URL}/reportes/historial/producto/${idProducto}`, { 
    headers: authHeaders() 
  });
  if (!res.ok) throw new Error('Error al obtener historial del producto');
  return res.json();
}

/**
 * Descarga el historial de producto en formato Excel.
 */
export async function descargarHistorialProductoExcel(idProducto: number): Promise<void> {
  const url = `${API_URL}/reportes/historial/producto/${idProducto}/excel`;
  await descargarArchivo(url, `historial_producto_${idProducto}.xlsx`);
}

/**
 * Descarga el historial de producto en formato PDF.
 */
export async function descargarHistorialProductoPdf(idProducto: number): Promise<void> {
  const url = `${API_URL}/reportes/historial/producto/${idProducto}/pdf`;
  await descargarArchivo(url, `historial_producto_${idProducto}.pdf`);
}

/**
 * Obtiene el stock por producto y depósito.
 */
export async function getStockPorProductoYDeposito(): Promise<StockProductoDeposito[]> {
  const res = await fetch(`${API_URL}/reportes/stock/producto-deposito`, { 
    headers: authHeaders() 
  });
  if (!res.ok) throw new Error('Error al obtener stock por producto y depósito');
  return res.json();
}

/**
 * Descarga el stock por producto y depósito en formato Excel.
 */
export async function descargarStockProductoDepositoExcel(): Promise<void> {
  const url = `${API_URL}/reportes/stock/producto-deposito/excel`;
  await descargarArchivo(url, `stock_producto_deposito.xlsx`);
}

/**
 * Descarga el stock por producto y depósito en formato PDF.
 */
export async function descargarStockProductoDepositoPdf(): Promise<void> {
  const url = `${API_URL}/reportes/stock/producto-deposito/pdf`;
  await descargarArchivo(url, `stock_producto_deposito.pdf`);
}
