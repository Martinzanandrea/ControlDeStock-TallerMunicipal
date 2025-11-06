import React, { useEffect, useState } from 'react';
import {
  Paper, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Stack, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert, TableSortLabel
} from '@mui/material';
import { getProductos, createProducto, deleteProducto, getProductosTipos, createProductoTipo, getProductoMarcas, createProductoMarca, getDepositos, reportes } from '../api';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import { ButtonGroup, Tooltip } from '@mui/material';
import type { Producto, ProductoTipo, ProductoMarca, Deposito } from '../interface';

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipos, setTipos] = useState<ProductoTipo[]>([]);
  const [marcas, setMarcas] = useState<ProductoMarca[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', tipoId: 0, marcaId: 0, depositoId: 0 });
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });
  const [orderBy, setOrderBy] = useState<'id'|'nombre'|'marca'|'tipo'>('id');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');

  const handleRequestSort = (key: typeof orderBy) => {
    if (orderBy === key) {
      setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(key);
      setOrder('asc');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const [prod, tps, mcs, deps] = await Promise.all([
      getProductos(),
      getProductosTipos(),
      getProductoMarcas(),
      getDepositos(),
    ]);
    setProductos(prod);
    setTipos(tps);
    setMarcas(mcs);
    setDepositos(deps);
  }

  async function handleCrearProducto() {
    if (!nuevoProducto.nombre || !nuevoProducto.marcaId || !nuevoProducto.tipoId || !nuevoProducto.depositoId) {
      setSnackbar({ open: true, message: 'Por favor complete todos los campos requeridos', severity: 'error' });
      return;
    }
    try {
      await createProducto({ ...nuevoProducto, estado: 'AC' });
      setNuevoProducto({ nombre: '', descripcion: '', tipoId: 0, marcaId: 0, depositoId: 0 });
      await cargarDatos();
      setSnackbar({ open: true, message: 'Producto creado exitosamente', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear el producto', severity: 'error' });
    }
  }

  function handleCancelarProducto(){
    setNuevoProducto({ nombre: '', descripcion: '', tipoId: 0, marcaId: 0, depositoId: 0 });
    setNuevaMarca('');
    setNuevoTipo('');
    setSnackbar({ open:true, message:'Operación cancelada', severity:'info' });
  }

  async function handleCrearMarca() {
    if (!nuevaMarca) return;
    try {
      await createProductoMarca({ nombre: nuevaMarca });
      setNuevaMarca('');
      await cargarDatos();
      setSnackbar({ open: true, message: 'Marca creada', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear marca', severity: 'error' });
    }
  }

  async function handleCrearTipo() {
    if (!nuevoTipo) {
      setSnackbar({ open: true, message: 'Ingrese un nombre para el tipo', severity: 'error' });
      return;
    }
    if (tipos.some(t => t.nombre.toLowerCase() === nuevoTipo.toLowerCase())) {
      setSnackbar({ open: true, message: 'Ya existe un tipo con este nombre', severity: 'error' });
      return;
    }
    try {
      await createProductoTipo({ nombre: nuevoTipo });
      setNuevoTipo('');
      await cargarDatos();
      setSnackbar({ open: true, message: 'Tipo creado exitosamente', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear tipo', severity: 'error' });
    }
  }

  async function handleEliminarProducto(id: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    try {
      await deleteProducto(id);
      setSnackbar({ open: true, message: 'Producto eliminado exitosamente', severity: 'success' });
      await cargarDatos();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al eliminar el producto', severity: 'error' });
    }
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Nuevo Producto</Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2
      }}>
        <Box>
          <TextField size="small" fullWidth label="Nombre" value={nuevoProducto.nombre} onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} />
        </Box>
        <Box>
          <TextField size="small" fullWidth label="Descripción" value={nuevoProducto.descripcion} onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} />
        </Box>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>Marca</InputLabel>
            <Select value={nuevoProducto.marcaId} onChange={e => setNuevoProducto({ ...nuevoProducto, marcaId: Number(e.target.value) })} label="Marca">
              <MenuItem value={0}>Seleccionar</MenuItem>
              {marcas.map(m => <MenuItem key={m.idProductoMarca} value={m.idProductoMarca}>{m.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
            <TextField size="small" label="Nueva marca" value={nuevaMarca} onChange={e => setNuevaMarca(e.target.value)} fullWidth />
            <Button variant="outlined" size="small" onClick={handleCrearMarca} sx={{ whiteSpace: 'nowrap', minWidth: { xs: '100%', sm: 'auto' } }}>Agregar</Button>
          </Stack>
        </Box>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo</InputLabel>
            <Select value={nuevoProducto.tipoId} onChange={e => setNuevoProducto({ ...nuevoProducto, tipoId: Number(e.target.value) })} label="Tipo">
              <MenuItem value={0}>Seleccionar</MenuItem>
              {tipos.map(t => <MenuItem key={t.id} value={t.id}>{t.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
            <TextField size="small" label="Nuevo tipo" value={nuevoTipo} onChange={e => setNuevoTipo(e.target.value)} fullWidth />
            <Button variant="outlined" size="small" onClick={handleCrearTipo} sx={{ whiteSpace: 'nowrap', minWidth: { xs: '100%', sm: 'auto' } }}>Agregar</Button>
          </Stack>
        </Box>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel>Depósito</InputLabel>
            <Select value={nuevoProducto.depositoId} onChange={e => setNuevoProducto({ ...nuevoProducto, depositoId: Number(e.target.value) })} label="Depósito">
              <MenuItem value={0}>Seleccionar</MenuItem>
              {depositos.map(d => <MenuItem key={d.idDeposito} value={d.idDeposito}>{d.nombre}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap:1 }}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={handleCrearProducto}
            sx={{
              px: 3,
              py: 1.2,
              lineHeight: 1.2,
              width: { xs: '100%', sm: 'auto' },
              boxShadow: 'none',
              fontWeight: 600
            }}
          >
            Crear Producto
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="medium"
            onClick={handleCancelarProducto}
            sx={{
              px:3,
              py:1.2,
              lineHeight:1.2,
              width: { xs: '100%', sm: 'auto' },
              boxShadow:'none',
              fontWeight:600
            }}>
            Cancelar
          </Button>
        </Box>
      </Box>
  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Productos</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 2, flexWrap:'wrap' }}>
        <ButtonGroup variant="outlined" size="small" sx={{ flexWrap:'wrap' }}>
          <Tooltip title="Stock por Tipo XLSX">
            <Button onClick={() => reportes.stockPorTipoExcel()} startIcon={<TableViewIcon />}>Tipo XLSX</Button>
          </Tooltip>
          <Tooltip title="Stock por Tipo PDF">
            <Button onClick={() => reportes.stockPorTipoPdf()} startIcon={<PictureAsPdfIcon />} color="secondary">Tipo PDF</Button>
          </Tooltip>
          <Tooltip title="Stock por Depósito XLSX">
            <Button onClick={() => reportes.stockPorDepositoExcel()} startIcon={<DownloadIcon />}>Depósito XLSX</Button>
          </Tooltip>
          <Tooltip title="Stock por Depósito PDF">
            <Button onClick={() => reportes.stockPorDepositoPdf()} startIcon={<PictureAsPdfIcon />} color="secondary">Depósito PDF</Button>
          </Tooltip>
        </ButtonGroup>
      </Stack>
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy === 'id' ? order : undefined}>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >ID</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy === 'nombre' ? order : undefined}>
                  <TableSortLabel
                    active={orderBy === 'nombre'}
                    direction={orderBy === 'nombre' ? order : 'asc'}
                    onClick={() => handleRequestSort('nombre')}
                  >Nombre</TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} sortDirection={orderBy === 'marca' ? order : undefined}>
                  <TableSortLabel
                    active={orderBy === 'marca'}
                    direction={orderBy === 'marca' ? order : 'asc'}
                    onClick={() => handleRequestSort('marca')}
                  >Marca</TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} sortDirection={orderBy === 'tipo' ? order : undefined}>
                  <TableSortLabel
                    active={orderBy === 'tipo'}
                    direction={orderBy === 'tipo' ? order : 'asc'}
                    onClick={() => handleRequestSort('tipo')}
                  >Tipo</TableSortLabel>
                </TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.length===0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontStyle:'italic', py:4 }}>
                    No hay productos registrados, cree uno.
                  </TableCell>
                </TableRow>
              )}
              {productos.length>0 && productos.slice().sort((a,b) => {
                let va: string|number = '';
                let vb: string|number = '';
                switch(orderBy){
                  case 'id': va = a.id; vb = b.id; break;
                  case 'nombre': va = a.nombre.toLowerCase(); vb = b.nombre.toLowerCase(); break;
                  case 'marca': va = (a.marca?.nombre||'').toLowerCase(); vb = (b.marca?.nombre||'').toLowerCase(); break;
                  case 'tipo': va = (a.tipo?.nombre||'').toLowerCase(); vb = (b.tipo?.nombre||'').toLowerCase(); break;
                }
                if (typeof va === 'number' && typeof vb === 'number') return order==='asc'? va - vb : vb - va;
                return order==='asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
              }).map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{p.marca?.nombre}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{p.tipo?.nombre}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ flexWrap:'wrap' }}>
                      <Tooltip title="Historial XLSX">
                        <Button variant="outlined" size="small" onClick={() => reportes.historialProductoExcel(p.id)} startIcon={<HistoryIcon />}>XLSX</Button>
                      </Tooltip>
                      <Tooltip title="Historial PDF">
                        <Button variant="outlined" size="small" onClick={() => reportes.historialProductoPdf(p.id)} startIcon={<PictureAsPdfIcon />} color="secondary">PDF</Button>
                      </Tooltip>
                      <Tooltip title="Eliminar producto">
                        <Button variant="contained" color="error" size="small" onClick={() => handleEliminarProducto(p.id)} startIcon={<DeleteIcon />}>Eliminar</Button>
                      </Tooltip>
                    </Stack>
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

export default Productos;
