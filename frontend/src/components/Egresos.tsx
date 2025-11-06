import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert, TableSortLabel } from '@mui/material';
import { getProductos, getDepositos, getVehiculos, getStockEgresos, createStockEgreso, deleteStockEgreso, getStockIngresado, createVehiculo, getProductoMarcas } from '../api';
import type { Producto, Deposito, Vehiculo, StockEgreso, StockIngresado, ProductoMarca } from '../interface';

// Formulario de egresos con validaciones básicas, selector de destino
// (oficina/vehículo), alta rápida de vehículo y tabla con ordenamiento.
// Incluye botón Cancelar para resetear el formulario y mensajes de feedback.
const Egresos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [marcas, setMarcas] = useState<ProductoMarca[]>([]);
  const [egresos, setEgresos] = useState<StockEgreso[]>([]);
  const [stockList, setStockList] = useState<StockIngresado[]>([]);
  const [nuevoEgreso, setNuevoEgreso] = useState({ productoId: 0, depositoId: 0, cantidad: 0, fechaEgreso: new Date().toISOString().slice(0,10), destinoTipo: 'OFICINA' as 'OFICINA'|'VEHICULO', idVehiculo: 0 });
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ dominio: '', marcaId: 0, modelo: '', anio: new Date().getFullYear() });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [orderBy, setOrderBy] = useState<'id'|'producto'|'deposito'|'cantidad'|'fecha'|'destino'>('id');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const handleRequestSort = (key: typeof orderBy) => {
    if(orderBy===key) setOrder(prev=> prev==='asc'?'desc':'asc'); else { setOrderBy(key); setOrder('asc'); }
  };

  useEffect(() => { cargarDatos(); }, []);

  // Carga inicial de catálogos y egresos en paralelo
  async function cargarDatos() {
    const [prod, deps, vehs, eg, stock, mcs] = await Promise.all([
      getProductos(),
      getDepositos(),
      getVehiculos(),
      getStockEgresos(),
      getStockIngresado(),
      getProductoMarcas(),
    ]);
    setProductos(prod);
    setDepositos(deps);
    setVehiculos(vehs);
    setEgresos(eg);
    setStockList(stock);
    setMarcas(mcs);
  }

  // Valida campos, verifica stock disponible y crea el egreso
  async function handleCrearEgreso() {
    if (!nuevoEgreso.productoId || !nuevoEgreso.depositoId || !nuevoEgreso.cantidad || !nuevoEgreso.fechaEgreso) {
      setSnackbar({ open: true, message: 'Por favor complete todos los campos requeridos', severity: 'error' });
      return;
    }
    if (nuevoEgreso.cantidad <= 0) {
      setSnackbar({ open: true, message: 'La cantidad debe ser mayor a 0', severity: 'error' });
      return;
    }
    const stockDisponible = stockList.find(item => item.producto.id === nuevoEgreso.productoId && item.deposito.idDeposito === nuevoEgreso.depositoId);
    if (!stockDisponible) {
      setSnackbar({ open: true, message: 'No hay stock disponible para este producto en el depósito seleccionado', severity: 'error' });
      return;
    }
    if (nuevoEgreso.cantidad > stockDisponible.cantidad) {
      setSnackbar({ open: true, message: `Stock insuficiente. Stock disponible: ${stockDisponible.cantidad}`, severity: 'error' });
      return;
    }
    try {
      await createStockEgreso({
        idProducto: nuevoEgreso.productoId,
        idDeposito: nuevoEgreso.depositoId,
        cantidad: nuevoEgreso.cantidad,
        fechaEgreso: nuevoEgreso.fechaEgreso,
        destinoTipo: nuevoEgreso.destinoTipo,
        idVehiculo: nuevoEgreso.destinoTipo === 'VEHICULO' ? nuevoEgreso.idVehiculo : undefined,
      });
      setNuevoEgreso({ productoId: 0, depositoId: 0, cantidad: 0, fechaEgreso: new Date().toISOString().slice(0,10), destinoTipo: 'OFICINA', idVehiculo: 0 });
      await cargarDatos();
      setSnackbar({ open: true, message: 'Egreso registrado exitosamente', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear egreso', severity: 'error' });
    }
  }

  // Restablece los campos del formulario y notifica cancelación
  function handleCancelarEgreso(){
    setNuevoEgreso({ productoId: 0, depositoId: 0, cantidad: 0, fechaEgreso: new Date().toISOString().slice(0,10), destinoTipo: 'OFICINA', idVehiculo: 0 });
    setNuevoVehiculo({ dominio: '', marcaId: 0, modelo: '', anio: new Date().getFullYear() });
    setSnackbar({ open:true, message:'Operación cancelada', severity:'info' });
  }

  // Elimina un egreso existente y recarga la tabla
  async function handleEliminarEgreso(id: number) {
    if (!window.confirm('¿Eliminar egreso?')) return;
    try {
      await deleteStockEgreso(id);
      await cargarDatos();
      setSnackbar({ open: true, message: 'Egreso eliminado exitosamente', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al eliminar egreso', severity: 'error' });
    }
  }

  // Alta rápida de vehículo cuando el destino es VEHICULO
  async function handleRegistrarVehiculo(data: typeof nuevoVehiculo) {
    if (!data.dominio || !data.modelo || !data.anio || !data.marcaId) {
      setSnackbar({ open: true, message: 'Completar todos los campos', severity: 'error' });
      return;
    }
    try {
      const veh = await createVehiculo(data);
      setVehiculos(prev => [...prev, veh]);
      setNuevoVehiculo({ dominio: '', modelo: '', anio: new Date().getFullYear(), marcaId: 0 });
      setNuevoEgreso(prev => ({ ...prev, idVehiculo: veh.idVehiculo }));
      setSnackbar({ open: true, message: 'Vehículo registrado', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al registrar vehículo', severity: 'error' });
    }
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Registrar Egreso</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
          <FormControl fullWidth>
            <InputLabel>Producto</InputLabel>
            <Select value={nuevoEgreso.productoId} onChange={e => setNuevoEgreso({ ...nuevoEgreso, productoId: Number(e.target.value) })} label="Producto">
              <MenuItem value={0}>Seleccionar</MenuItem>
              {productos.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
          <FormControl fullWidth>
            <InputLabel>Depósito</InputLabel>
            <Select value={nuevoEgreso.depositoId} onChange={e => setNuevoEgreso({ ...nuevoEgreso, depositoId: Number(e.target.value) })} label="Depósito">
              <MenuItem value={0}>Seleccionar</MenuItem>
              {depositos.map(d => <MenuItem key={d.idDeposito} value={d.idDeposito}>{d.nombre}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
          <TextField fullWidth type="number" label="Cantidad" value={nuevoEgreso.cantidad} onChange={e => setNuevoEgreso({ ...nuevoEgreso, cantidad: Number(e.target.value) })} />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
          <TextField fullWidth type="date" label="Fecha" value={nuevoEgreso.fechaEgreso} onChange={e => setNuevoEgreso({ ...nuevoEgreso, fechaEgreso: e.target.value })} InputLabelProps={{ shrink: true }} />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
          <FormControl fullWidth>
            <InputLabel>Destino</InputLabel>
            <Select value={nuevoEgreso.destinoTipo} onChange={e => setNuevoEgreso({ ...nuevoEgreso, destinoTipo: e.target.value as 'OFICINA'|'VEHICULO' })} label="Destino">
              <MenuItem value={'OFICINA'}>Oficina</MenuItem>
              <MenuItem value={'VEHICULO'}>Vehículo</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {nuevoEgreso.destinoTipo === 'VEHICULO' && (
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '100%', md: '100%' } }}>
            <FormControl fullWidth>
              <InputLabel>Vehículo</InputLabel>
              <Select value={nuevoEgreso.idVehiculo} onChange={e => setNuevoEgreso({ ...nuevoEgreso, idVehiculo: Number(e.target.value) })} label="Vehículo">
                <MenuItem value={0}>Seleccionar</MenuItem>
                {vehiculos.map(v => <MenuItem key={v.idVehiculo} value={v.idVehiculo}>{v.dominio}</MenuItem>)}
              </Select>
            </FormControl>
            <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>Registrar nuevo vehículo</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%' } }}>
                  <TextField label="Dominio" value={nuevoVehiculo.dominio} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, dominio: e.target.value })} fullWidth />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%' } }}>
                  <TextField label="Modelo" value={nuevoVehiculo.modelo} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })} fullWidth />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%' } }}>
                  <TextField label="Año" type="number" value={nuevoVehiculo.anio} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, anio: Number(e.target.value) })} fullWidth />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Marca</InputLabel>
                    <Select value={nuevoVehiculo.marcaId} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, marcaId: Number(e.target.value) })} label="Marca">
                      <MenuItem value={0}>Seleccionar</MenuItem>
                      {marcas.map(m => <MenuItem key={m.idProductoMarca} value={m.idProductoMarca}>{m.nombre}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }} onClick={() => handleRegistrarVehiculo(nuevoVehiculo)}>Registrar Vehículo</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' }, display:'flex', gap:1 }}>
          <Button variant="contained" color="warning" onClick={handleCrearEgreso} fullWidth sx={{ height: '100%', minHeight: '56px' }}>Registrar Egreso</Button>
          <Button variant="outlined" color="inherit" onClick={handleCancelarEgreso} fullWidth sx={{ height: '100%', minHeight: '56px' }}>Cancelar</Button>
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Egresos registrados</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy==='id'?order:undefined}>
                  <TableSortLabel active={orderBy==='id'} direction={orderBy==='id'?order:'asc'} onClick={()=>handleRequestSort('id')}>ID</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy==='producto'?order:undefined}>
                  <TableSortLabel active={orderBy==='producto'} direction={orderBy==='producto'?order:'asc'} onClick={()=>handleRequestSort('producto')}>Producto</TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} sortDirection={orderBy==='deposito'?order:undefined}>
                  <TableSortLabel active={orderBy==='deposito'} direction={orderBy==='deposito'?order:'asc'} onClick={()=>handleRequestSort('deposito')}>Depósito</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy==='cantidad'?order:undefined}>
                  <TableSortLabel active={orderBy==='cantidad'} direction={orderBy==='cantidad'?order:'asc'} onClick={()=>handleRequestSort('cantidad')}>Cantidad</TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} sortDirection={orderBy==='fecha'?order:undefined}>
                  <TableSortLabel active={orderBy==='fecha'} direction={orderBy==='fecha'?order:'asc'} onClick={()=>handleRequestSort('fecha')}>Fecha</TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }} sortDirection={orderBy==='destino'?order:undefined}>
                  <TableSortLabel active={orderBy==='destino'} direction={orderBy==='destino'?order:'asc'} onClick={()=>handleRequestSort('destino')}>Destino</TableSortLabel>
                </TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {egresos.length===0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ fontStyle:'italic', py:4 }}>
                    No hay egresos registrados.
                  </TableCell>
                </TableRow>
              )}
              {egresos.length>0 && egresos.slice().sort((a,b)=>{
                let va: string|number=''; let vb: string|number='';
                switch(orderBy){
                  case 'id': va = a.idStockEgreso; vb = b.idStockEgreso; break;
                  case 'producto': va = (a.producto?.nombre||'').toLowerCase(); vb = (b.producto?.nombre||'').toLowerCase(); break;
                  case 'deposito': va = (a.deposito?.nombre||'').toLowerCase(); vb = (b.deposito?.nombre||'').toLowerCase(); break;
                  case 'cantidad': va = a.cantidad; vb = b.cantidad; break;
                  case 'fecha': va = a.fechaEgreso || ''; vb = b.fechaEgreso || ''; break;
                  case 'destino': {
                    const da = `${a.destinoTipo}${a.vehiculo?`-${a.vehiculo.dominio}`:''}`.toLowerCase();
                    const db = `${b.destinoTipo}${b.vehiculo?`-${b.vehiculo.dominio}`:''}`.toLowerCase();
                    va = da; vb = db; break;
                  }
                }
                if(typeof va === 'number' && typeof vb === 'number') return order==='asc'? va - vb : vb - va;
                return order==='asc'? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
              }).map(e => (
                <TableRow key={e.idStockEgreso}>
                  <TableCell>{e.idStockEgreso}</TableCell>
                  <TableCell>{e.producto?.nombre}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{e.deposito?.nombre}</TableCell>
                  <TableCell>{e.cantidad}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{e.fechaEgreso}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{e.destinoTipo}{e.vehiculo ? ` - ${e.vehiculo.dominio}` : ''}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="error" size="small" onClick={() => handleEliminarEgreso(e.idStockEgreso)}>Eliminar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default Egresos;
