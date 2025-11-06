import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert, TableSortLabel } from '@mui/material';
import { getProductos, getDepositos, getStockIngresado, createStockIngresado, deleteStockIngresado } from '../api';
import type { Producto, Deposito, StockIngresado } from '../interface';

const Stock: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [stock, setStock] = useState({ productoId: 0, depositoId: 0, cantidad: 0 });
  const [stockList, setStockList] = useState<StockIngresado[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [orderBy, setOrderBy] = useState<'producto'|'marca'|'tipo'|'deposito'|'cantidad'>('producto');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    const [prod, deps, stockActual] = await Promise.all([
      getProductos(),
      getDepositos(),
      getStockIngresado(),
    ]);
    setProductos(prod);
    setDepositos(deps);
    setStockList(stockActual);
  }

  async function handleAgregarStock() {
    if (!stock.productoId || !stock.depositoId || !stock.cantidad) {
      setSnackbar({ open: true, message: 'Por favor complete todos los campos requeridos', severity: 'error' });
      return;
    }
    try {
      await createStockIngresado({
        idProducto: stock.productoId,
        idDeposito: stock.depositoId,
        cantidad: stock.cantidad,
        fechaIngreso: new Date().toISOString(),
        estado: 'AC',
      });
      setStock({ productoId: 0, depositoId: 0, cantidad: 0 });
      await cargarDatos();
      setSnackbar({ open: true, message: 'Stock agregado exitosamente', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al agregar stock', severity: 'error' });
    }
  }

  function handleCancelarStock(){
    setStock({ productoId: 0, depositoId: 0, cantidad: 0 });
    setSnackbar({ open:true, message:'Operación cancelada', severity:'info' });
  }

  async function handleEliminarStock(idProducto: number, idDeposito: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este stock?')) return;
    try {
      await deleteStockIngresado(idProducto, idDeposito);
      setSnackbar({ open: true, message: 'Stock eliminado exitosamente', severity: 'success' });
      await cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al eliminar el stock', severity: 'error' });
    }
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleRequestSort = (key: typeof orderBy) => {
    if (orderBy === key) setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setOrderBy(key); setOrder('asc'); }
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Agregar Stock</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
            <FormControl fullWidth>
              <InputLabel>Producto</InputLabel>
              <Select value={stock.productoId} onChange={e => setStock({ ...stock, productoId: Number(e.target.value) })} label="Producto">
                <MenuItem value={0}>Seleccionar</MenuItem>
                {productos.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
            <FormControl fullWidth>
              <InputLabel>Depósito</InputLabel>
              <Select value={stock.depositoId} onChange={e => setStock({ ...stock, depositoId: Number(e.target.value) })} label="Depósito">
                <MenuItem value={0}>Seleccionar</MenuItem>
                {depositos.map(d => <MenuItem key={d.idDeposito} value={d.idDeposito}>{d.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '20%' } }}>
            <TextField fullWidth type="number" label="Cantidad" value={stock.cantidad} onChange={e => setStock({ ...stock, cantidad: Number(e.target.value) })} />
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '20%' }, display:'flex', gap:1 }}>
            <Button variant="contained" color="success" onClick={handleAgregarStock} fullWidth sx={{ height: '100%', minHeight: '56px' }}>Agregar Stock</Button>
            <Button variant="outlined" color="inherit" onClick={handleCancelarStock} fullWidth sx={{ height: '100%', minHeight: '56px' }}>Cancelar</Button>
          </Box>
        </Box>
      </Paper>
      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom>Stock Actual</Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer>
            <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={orderBy==='producto'?order:undefined}>
                    <TableSortLabel active={orderBy==='producto'} direction={orderBy==='producto'?order:'asc'} onClick={() => handleRequestSort('producto')}>Producto</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} sortDirection={orderBy==='marca'?order:undefined}>
                    <TableSortLabel active={orderBy==='marca'} direction={orderBy==='marca'?order:'asc'} onClick={() => handleRequestSort('marca')}>Marca</TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} sortDirection={orderBy==='tipo'?order:undefined}>
                    <TableSortLabel active={orderBy==='tipo'} direction={orderBy==='tipo'?order:'asc'} onClick={() => handleRequestSort('tipo')}>Tipo</TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={orderBy==='deposito'?order:undefined}>
                    <TableSortLabel active={orderBy==='deposito'} direction={orderBy==='deposito'?order:'asc'} onClick={() => handleRequestSort('deposito')}>Depósito</TableSortLabel>
                  </TableCell>
                  <TableCell align="right" sortDirection={orderBy==='cantidad'?order:undefined}>
                    <TableSortLabel active={orderBy==='cantidad'} direction={orderBy==='cantidad'?order:'asc'} onClick={() => handleRequestSort('cantidad')}>Cantidad</TableSortLabel>
                  </TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ fontStyle:'italic', py:4 }}>No hay stock ingresado.</TableCell>
                  </TableRow>
                )}
                {stockList.length > 0 && stockList.slice().sort((a,b)=>{
                  let va: string|number = '';
                  let vb: string|number = '';
                  switch(orderBy){
                    case 'producto': va = (a.producto.nombre||'').toLowerCase(); vb = (b.producto.nombre||'').toLowerCase(); break;
                    case 'marca': va = (a.producto.marca?.nombre||'').toLowerCase(); vb = (b.producto.marca?.nombre||'').toLowerCase(); break;
                    case 'tipo': va = (a.producto.tipo?.nombre||'').toLowerCase(); vb = (b.producto.tipo?.nombre||'').toLowerCase(); break;
                    case 'deposito': va = (a.deposito.nombre||'').toLowerCase(); vb = (b.deposito.nombre||'').toLowerCase(); break;
                    case 'cantidad': va = a.cantidad; vb = b.cantidad; break;
                  }
                  if (typeof va === 'number' && typeof vb === 'number') return order==='asc'? va - vb : vb - va;
                  return order==='asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
                }).map(item => (
                  <TableRow key={`${item.producto.id}-${item.deposito.idDeposito}`}>
                    <TableCell>{item.producto.nombre}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{item.producto.marca?.nombre}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{item.producto.tipo?.nombre}</TableCell>
                    <TableCell>{item.deposito.nombre}</TableCell>
                    <TableCell align="right">{item.cantidad}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" color="error" size="small" onClick={() => handleEliminarStock(item.producto.id, item.deposito.idDeposito)}>Eliminar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default Stock;
