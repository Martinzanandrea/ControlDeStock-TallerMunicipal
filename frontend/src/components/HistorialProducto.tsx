import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Snackbar, 
  Alert,
  Chip
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { getProductos } from '../api';
import { getHistorialProducto, descargarHistorialProductoExcel, descargarHistorialProductoPdf } from '../api';
import type { Producto } from '../interface';
import type { MovimientoProducto } from '../api';

/**
 * Componente para consultar el historial de movimientos por producto.
 * Permite seleccionar un producto y ver todos sus ingresos y egresos,
 * con opciones de descarga en Excel y PDF.
 */
const HistorialProducto: React.FC = () => {
  const [productos, setProductos] = React.useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoProducto[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  React.useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const prods = await getProductos();
      setProductos(prods);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al cargar productos', severity: 'error' });
    }
  }

  async function handleConsultarHistorial() {
    if (!productoSeleccionado) {
      setSnackbar({ open: true, message: 'Seleccione un producto', severity: 'error' });
      return;
    }
    try {
      const data = await getHistorialProducto(productoSeleccionado);
      setMovimientos(data);
      if (data.length === 0) {
        setSnackbar({ open: true, message: 'No hay movimientos para este producto', severity: 'info' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al consultar historial', severity: 'error' });
    }
  }

  async function handleDescargarExcel() {
    if (!productoSeleccionado) {
      setSnackbar({ open: true, message: 'Seleccione un producto primero', severity: 'error' });
      return;
    }
    try {
      await descargarHistorialProductoExcel(productoSeleccionado);
      setSnackbar({ open: true, message: 'Descarga de Excel completada', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al descargar Excel', severity: 'error' });
    }
  }

  async function handleDescargarPdf() {
    if (!productoSeleccionado) {
      setSnackbar({ open: true, message: 'Seleccione un producto primero', severity: 'error' });
      return;
    }
    try {
      await descargarHistorialProductoPdf(productoSeleccionado);
      setSnackbar({ open: true, message: 'Descarga de PDF completada', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al descargar PDF', severity: 'error' });
    }
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const productoNombre = productos.find(p => p.id === productoSeleccionado)?.nombre || '';

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Historial de Movimientos por Producto</Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '40%' } }}>
          <FormControl fullWidth>
            <InputLabel>Producto</InputLabel>
            <Select 
              value={productoSeleccionado ?? ''} 
              onChange={e => setProductoSeleccionado(e.target.value ? Number(e.target.value) : null)} 
              label="Producto"
            >
              <MenuItem value="">Seleccionar</MenuItem>
              {productos.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre} - Stock: {p.stockActual}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleConsultarHistorial}
            sx={{ minHeight: '56px' }}
          >
            Consultar Historial
          </Button>
          
          {movimientos.length > 0 && (
            <>
              <Button 
                variant="outlined" 
                color="success" 
                startIcon={<Download />}
                onClick={handleDescargarExcel}
                sx={{ minHeight: '56px' }}
              >
                Excel
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<Download />}
                onClick={handleDescargarPdf}
                sx={{ minHeight: '56px' }}
              >
                PDF
              </Button>
            </>
          )}
        </Box>
      </Box>

      {productoNombre && movimientos.length > 0 && (
        <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
          Producto: {productoNombre} ({movimientos.length} movimientos)
        </Typography>
      )}

      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Depósito</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Destino</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Vehículo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ fontStyle: 'italic', py: 4 }}>
                    Seleccione un producto y haga clic en "Consultar Historial" para ver los movimientos.
                  </TableCell>
                </TableRow>
              )}
              {movimientos.map((mov, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Chip 
                      label={mov.tipo} 
                      color={mov.tipo === 'INGRESO' ? 'success' : 'warning'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(mov.fecha).toLocaleDateString('es-AR')}</TableCell>
                  <TableCell>{mov.cantidad}</TableCell>
                  <TableCell>{mov.deposito || '-'}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {mov.destinoTipo || '-'}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {mov.vehiculo || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default HistorialProducto;
