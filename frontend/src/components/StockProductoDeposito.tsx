import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Button, 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Snackbar, 
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { Download, Search } from '@mui/icons-material';
import { 
  getStockPorProductoYDeposito, 
  descargarStockProductoDepositoExcel, 
  descargarStockProductoDepositoPdf,
  type StockProductoDeposito 
} from '../api';

/**
 * Componente para consultar el stock disponible por producto y depósito.
 * Muestra una tabla con todos los productos y su stock en cada depósito,
 * con opciones de descarga en Excel y PDF.
 */
const StockProductoDepositoComponent: React.FC = () => {
  const [datos, setDatos] = useState<StockProductoDeposito[]>([]);
  const [datosFiltrados, setDatosFiltrados] = useState<StockProductoDeposito[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' 
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setDatosFiltrados(datos);
    } else {
      const termino = busqueda.toLowerCase().trim();
      const filtrados = datos.filter(
        item => {
          const producto = (item.producto || '').toLowerCase();
          const deposito = (item.deposito || '').toLowerCase();
          return producto.includes(termino) || deposito.includes(termino);
        }
      );
      setDatosFiltrados(filtrados);
    }
  }, [busqueda, datos]);

  async function cargarDatos() {
    try {
      const data = await getStockPorProductoYDeposito();
      setDatos(data);
      setDatosFiltrados(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ 
        open: true, 
        message: msg || 'Error al cargar stock', 
        severity: 'error' 
      });
    }
  }

  async function handleDescargarExcel() {
    try {
      await descargarStockProductoDepositoExcel();
      setSnackbar({ 
        open: true, 
        message: 'Descarga de Excel completada', 
        severity: 'success' 
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ 
        open: true, 
        message: msg || 'Error al descargar Excel', 
        severity: 'error' 
      });
    }
  }

  async function handleDescargarPdf() {
    try {
      await descargarStockProductoDepositoPdf();
      setSnackbar({ 
        open: true, 
        message: 'Descarga de PDF completada', 
        severity: 'success' 
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ 
        open: true, 
        message: msg || 'Error al descargar PDF', 
        severity: 'error' 
      });
    }
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Stock por Producto y Depósito
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '300px' } }}>
          <TextField
            fullWidth
            placeholder="Buscar por producto o depósito..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            color="success" 
            startIcon={<Download />}
            onClick={handleDescargarExcel}
          >
            Excel
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Download />}
            onClick={handleDescargarPdf}
          >
            PDF
          </Button>
        </Box>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Depósito</TableCell>
                <TableCell align="right">Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ fontStyle: 'italic', py: 4 }}>
                    {busqueda ? 'No se encontraron resultados' : 'No hay stock registrado'}
                  </TableCell>
                </TableRow>
              )}
              {datosFiltrados.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.producto}</TableCell>
                  <TableCell>{item.deposito}</TableCell>
                  <TableCell align="right">{item.stock}</TableCell>
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

export default StockProductoDepositoComponent;
