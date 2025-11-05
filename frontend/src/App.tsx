// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import {
  getProductos,
  createProducto,
  deleteProducto,
  getProductosTipos,
  createProductoTipo,
  getProductoMarcas,
  createProductoMarca,
  getDepositos,
  createDeposito,
  getVehiculos,
  createVehiculo,
  getStockIngresado,
  createStockIngresado,
} from './api';
import type {
  Producto,
  ProductoTipo,
  ProductoMarca,
  Deposito,
  Vehiculo,
  StockIngresado,
} from './interface';

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipos, setTipos] = useState<ProductoTipo[]>([]);
  const [marcas, setMarcas] = useState<ProductoMarca[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [stock, setStock] = useState({ productoId: 0, depositoId: 0, cantidad: 0 });

  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', tipoId: 0, marcaId: 0 });
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [nuevoDeposito, setNuevoDeposito] = useState({ nombre: '', ubicacion: '' });
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ dominio: '', marcaId: 0, modelo: '', anio: 2023 });

  // Cargar todos los datos al inicio
  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const [prod, tps, mcs, deps, vehs] = await Promise.all([
      getProductos(),
      getProductosTipos(),
      getProductoMarcas(),
      getDepositos(),
      getVehiculos(),
    ]);
    setProductos(prod);
    setTipos(tps);
    setMarcas(mcs);
    setDepositos(deps);
    setVehiculos(vehs);
  }

  // Funciones de creación
  async function handleCrearProducto() {
    if (!nuevoProducto.nombre || !nuevoProducto.marcaId || !nuevoProducto.tipoId) return;
    await createProducto(nuevoProducto);
    setNuevoProducto({ nombre: '', descripcion: '', tipoId: 0, marcaId: 0 });
    cargarDatos();
  }

  async function handleCrearMarca() {
    if (!nuevaMarca) return;
    await createProductoMarca({ nombre: nuevaMarca });
    setNuevaMarca('');
    cargarDatos();
  }

  async function handleCrearTipo() {
    if (!nuevoTipo) return;
    await createProductoTipo({ descripcion: nuevoTipo });
    setNuevoTipo('');
    cargarDatos();
  }

  async function handleCrearDeposito() {
    if (!nuevoDeposito.nombre || !nuevoDeposito.ubicacion) return;
    await createDeposito(nuevoDeposito);
    setNuevoDeposito({ nombre: '', ubicacion: '' });
    cargarDatos();
  }

  async function handleCrearVehiculo() {
    if (!nuevoVehiculo.dominio || !nuevoVehiculo.marcaId || !nuevoVehiculo.modelo || !nuevoVehiculo.anio) return;
    await createVehiculo(nuevoVehiculo);
    setNuevoVehiculo({ dominio: '', marcaId: 0, modelo: '', anio: 2023 });
    cargarDatos();
  }

  async function handleAgregarStock() {
    if (!stock.productoId || !stock.depositoId || !stock.cantidad) return;
    await createStockIngresado({
      idProducto: stock.productoId,
      idDeposito: stock.depositoId,
      cantidad: stock.cantidad,
      fechaIngreso: new Date().toISOString(),
      estado: 'AC',
    });
    setStock({ productoId: 0, depositoId: 0, cantidad: 0 });
    alert('Stock agregado');
  }

  async function handleEliminarProducto(id: number) {
    if (!confirm('Eliminar producto?')) return;
    await deleteProducto(id);
    cargarDatos();
  }

  return (
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Control de Stock Municipal</h1>

      {/* Crear Producto */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Nuevo Producto</h2>
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
          className="border p-1 mr-2"
        />
        <select
          value={nuevoProducto.marcaId}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, marcaId: Number(e.target.value) })}
          className="border p-1 mr-2"
        >
          <option value={0}>Marca</option>
          {marcas.map((m) => (
            <option key={m.idProductoMarca} value={m.idProductoMarca}>
              {m.nombre}
            </option>
          ))}
        </select>
        <select
          value={nuevoProducto.tipoId}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, tipoId: Number(e.target.value) })}
          className="border p-1 mr-2"
        >
          <option value={0}>Tipo</option>
          {tipos.map((t) => (
            <option key={t.idProductoTipo} value={t.idProductoTipo}>
              {t.descripcion}
            </option>
          ))}
        </select>
        <button onClick={handleCrearProducto} className="bg-blue-500 text-white px-3 py-1 rounded">
          Crear Producto
        </button>
      </div>

      {/* Lista de Productos */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Productos</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-1">ID</th>
              <th className="border p-1">Nombre</th>
              <th className="border p-1">Marca</th>
              <th className="border p-1">Tipo</th>
              <th className="border p-1">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.idProducto}>
                <td className="border p-1">{p.idProducto}</td>
                <td className="border p-1">{p.nombre}</td>
                <td className="border p-1">{p.marca?.nombre}</td>
                <td className="border p-1">{p.tipo?.descripcion}</td>
                <td className="border p-1">
                  <button
                    onClick={() => handleEliminarProducto(p.idProducto)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Agregar Stock */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Agregar Stock</h2>
        <select
          value={stock.productoId}
          onChange={(e) => setStock({ ...stock, productoId: Number(e.target.value) })}
          className="border p-1 mr-2"
        >
          <option value={0}>Producto</option>
          {productos.map((p) => (
            <option key={p.idProducto} value={p.idProducto}>
              {p.nombre}
            </option>
          ))}
        </select>
        <select
          value={stock.depositoId}
          onChange={(e) => setStock({ ...stock, depositoId: Number(e.target.value) })}
          className="border p-1 mr-2"
        >
          <option value={0}>Depósito</option>
          {depositos.map((d) => (
            <option key={d.idDeposito} value={d.idDeposito}>
              {d.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Cantidad"
          value={stock.cantidad}
          onChange={(e) => setStock({ ...stock, cantidad: Number(e.target.value) })}
          className="border p-1 mr-2"
        />
        <button onClick={handleAgregarStock} className="bg-green-500 text-white px-3 py-1 rounded">
          Agregar Stock
        </button>
      </div>
    </div>
  );
}
