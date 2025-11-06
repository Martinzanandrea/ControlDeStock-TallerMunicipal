// frontend/src/App.tsx
import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Alert,
  Snackbar,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  getProductos,
  createProducto,
  deleteProducto,
  getProductosTipos,
  createProductoTipo,
  getProductoMarcas,
  createProductoMarca,
  getDepositos,
  getVehiculos,
  getStockIngresado,
  createStockIngresado,
  getStockEgresos,
  createStockEgreso,
  deleteStockEgreso,
  deleteStockIngresado,
} from './api';
import type {
  Producto,
  ProductoTipo,
  ProductoMarca,
  Deposito,
  Vehiculo,
  StockIngresado,
  StockEgreso,
} from './interface';

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipos, setTipos] = useState<ProductoTipo[]>([]);
  const [marcas, setMarcas] = useState<ProductoMarca[]>([]);
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [stock, setStock] = useState({ productoId: 0, depositoId: 0, cantidad: 0 });
  const [egresos, setEgresos] = useState<StockEgreso[]>([]);

  const [nuevoEgreso, setNuevoEgreso] = useState({ 
    productoId: 0, 
    depositoId: 0, 
    cantidad: 0, 
    fechaEgreso: new Date().toISOString().slice(0,10), 
    destinoTipo: 'OFICINA' as 'OFICINA'|'VEHICULO', 
    idVehiculo: 0 
  });

  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', tipoId: 0, marcaId: 0, depositoId: 0 });
  const [nuevaMarca, setNuevaMarca] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('');
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ dominio: '', marcaId: 0, modelo: '', anio: new Date().getFullYear() });
  const [stockList, setStockList] = useState<StockIngresado[]>([]); // Nuevo estado para el listado de stock

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
    // cargar egresos
    try {
      const eg = await getStockEgresos();
      setEgresos(eg);
    } catch (err) {
      // no bloquear si falla
      console.warn('No se pudo cargar egresos', err);
    }
    // cargar stock actual
    try {
      const stockActual = await getStockIngresado();
      setStockList(stockActual);
    } catch (err) {
      setStockList([]);
      console.warn('No se pudo cargar stock actual', err);
    }
  }

  // Funciones de creación
  async function handleCrearProducto() {
    if (!nuevoProducto.nombre || !nuevoProducto.marcaId || !nuevoProducto.tipoId || !nuevoProducto.depositoId) {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        severity: 'error'
      });
      return;
    }
    try {
      await createProducto({ ...nuevoProducto, estado: 'AC' });
      setNuevoProducto({ nombre: '', descripcion: '', tipoId: 0, marcaId: 0, depositoId: 0 });
      await cargarDatos();
      setSnackbar({ open: true, message: 'Producto creado exitosamente', severity: 'success' });
    } catch (err: unknown) {
      console.error('Error crear producto', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear el producto', severity: 'error' });
    }
  }

  async function handleCrearMarca() {
    if (!nuevaMarca) return;
    try {
      await createProductoMarca({ nombre: nuevaMarca });
      setNuevaMarca('');
      await cargarDatos();
      setSnackbar({ open: true, message: 'Marca creada', severity: 'success' });
    } catch (err: unknown) {
      console.error('Error crear marca', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear marca', severity: 'error' });
    }
  }

  async function handleCrearTipo() {
    if (!nuevoTipo) {
      setSnackbar({ open: true, message: 'Ingrese un nombre para el tipo', severity: 'error' });
      return;
    }
    
    // Verificar si ya existe un tipo con el mismo nombre
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
      console.error('Error crear tipo', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear tipo', severity: 'error' });
    }
  }

  // handlers for crear tipo/deposito/vehiculo removed (no UI controls present). Keep API functions in `api.ts` if needed later.

  async function handleAgregarStock() {
    if (!stock.productoId || !stock.depositoId || !stock.cantidad) {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        severity: 'error'
      });
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
        setSnackbar({
          open: true,
          message: 'Stock agregado exitosamente',
          severity: 'success'
        });
      } catch (err: unknown) {
      console.error('Error agregar stock', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al agregar stock', severity: 'error' });
    }
  }

  async function handleCrearEgreso() {
    if (!nuevoEgreso.productoId || !nuevoEgreso.depositoId || !nuevoEgreso.cantidad || !nuevoEgreso.fechaEgreso) {
      setSnackbar({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        severity: 'error'
      });
      return;
    }

    // Validar que la cantidad no sea negativa o cero
    if (nuevoEgreso.cantidad <= 0) {
      setSnackbar({
        open: true,
        message: 'La cantidad debe ser mayor a 0',
        severity: 'error'
      });
      return;
    }

    // Validar stock disponible
    const stockDisponible = stockList.find(
      item => item.producto.id === nuevoEgreso.productoId && 
             item.deposito.idDeposito === nuevoEgreso.depositoId
    );

    if (!stockDisponible) {
      setSnackbar({
        open: true,
        message: 'No hay stock disponible para este producto en el depósito seleccionado',
        severity: 'error'
      });
      return;
    }

    if (nuevoEgreso.cantidad > stockDisponible.cantidad) {
      setSnackbar({
        open: true,
        message: `Stock insuficiente. Stock disponible: ${stockDisponible.cantidad}`,
        severity: 'error'
      });
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
      setSnackbar({
        open: true,
        message: 'Egreso registrado exitosamente',
        severity: 'success'
      });
    } catch (err: unknown) {
      console.error('Error crear egreso', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al crear egreso', severity: 'error' });
    }
  }

  async function handleEliminarEgreso(id: number) {
    if (!confirm('¿Eliminar egreso?')) return;
    try {
      await deleteStockEgreso(id);
      cargarDatos();
    } catch (err: unknown) {
      console.error('Error eliminar egreso', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al eliminar egreso', severity: 'error' });
    }
  }
  async function handleRegistrarVehiculo()  {
    // This function was removed since there is no UI for it --- IGNORE ---
  }
  async function handleEliminarStock(idProducto: number, idDeposito: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este stock?')) return;
    
    try {
      // Verificar si hay egresos asociados a este stock
      const tieneEgresos = egresos.some(e => 
        e.producto?.id === idProducto && e.deposito?.idDeposito === idDeposito
      );
      
      if (tieneEgresos) {
        setSnackbar({ 
          open: true, 
          message: 'No se puede eliminar el stock porque tiene egresos asociados', 
          severity: 'error' 
        });
        return;
      }

      // Buscar el item de stock actual
      const stockItem = stockList.find(item => 
        item.producto.id === idProducto && item.deposito.idDeposito === idDeposito
      );

      if (!stockItem) {
        setSnackbar({ 
          open: true, 
          message: 'No se encontró el stock especificado', 
          severity: 'error' 
        });
        return;
      }

      await deleteStockIngresado(idProducto, idDeposito);
      
      // Actualizar la lista de stock inmediatamente
      setStockList(stockList.filter(item => 
        !(item.producto.id === idProducto && item.deposito.idDeposito === idDeposito)
      ));
      
      setSnackbar({ 
        open: true, 
        message: 'Stock eliminado exitosamente', 
        severity: 'success' 
      });
      
      // Recargar todos los datos para asegurar la sincronización
      await cargarDatos();
    } catch (err: unknown) {
      console.error('Error eliminar stock', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ 
        open: true, 
        message: msg || 'Error al eliminar el stock', 
        severity: 'error' 
      });
    }
  }

  async function handleEliminarProducto(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
      // Verificar si el producto tiene stock o egresos asociados
      const stockAsociado = stockList.some(s => s.producto.id === id);
      const egresoAsociado = egresos.some(e => e.producto?.id === id);
      
      if (stockAsociado || egresoAsociado) {
        setSnackbar({ 
          open: true, 
          message: 'No se puede eliminar el producto porque tiene stock o egresos asociados', 
          severity: 'error' 
        });
        return;
      }

      await deleteProducto(id);
      
      // Actualizar la lista de productos inmediatamente
      setProductos(productos.filter(p => p.id !== id));
      
      setSnackbar({ 
        open: true, 
        message: 'Producto eliminado exitosamente', 
        severity: 'success' 
      });

      // Recargar todos los datos para asegurar la sincronización
      await cargarDatos();
    } catch (err: unknown) {
      console.error('Error eliminar producto', err);
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ 
        open: true, 
        message: msg || 'Error al eliminar el producto: podría tener stock o egresos asociados', 
        severity: 'error' 
      });
    }
  }

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: '#f5f5f5',
      },
    },
    typography: {
      h4: {
        fontWeight: 700,
        color: '#1565c0',
        textAlign: 'center',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
        <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '60px',
                height: '4px',
                backgroundColor: '#1976d2',
                margin: '15px auto',
                borderRadius: '2px',
              }
            }}
          >
            Control de Stock Municipal
          </Typography>

          {/* Crear Producto */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nuevo Producto
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
                <TextField
                  fullWidth
                  label="Descripción"
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Marca</InputLabel>
                  <Select
                    value={nuevoProducto.marcaId}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, marcaId: Number(e.target.value) })}
                    label="Marca"
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {marcas.map((m) => (
                      <MenuItem key={m.idProductoMarca} value={m.idProductoMarca}>
                        {m.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Nuevo: campo y botón para crear una marca rápidamente */}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    size="small"
                    label="Nueva marca"
                    value={nuevaMarca}
                    onChange={(e) => setNuevaMarca(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    onClick={handleCrearMarca}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Agregar
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={nuevoProducto.tipoId}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, tipoId: Number(e.target.value) })}
                    label="Tipo"
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {tipos.map((t) => (
                      <MenuItem key={t.id} value={t.id}>
                        {t.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Campo para crear un tipo rápidamente */}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField
                    size="small"
                    label="Nuevo tipo"
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
                    fullWidth
                  />
                  <Button variant="outlined" onClick={handleCrearTipo} sx={{ whiteSpace: 'nowrap' }}>
                    Agregar
                  </Button>
                </Stack>
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Depósito</InputLabel>
                  <Select
                    value={nuevoProducto.depositoId}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, depositoId: Number(e.target.value) })}
                    label="Depósito"
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {depositos.map((d) => (
                      <MenuItem key={d.idDeposito} value={d.idDeposito}>
                        {d.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '10%' } }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleCrearProducto}
                  fullWidth
                  sx={{ height: '100%', minHeight: '56px' }}
                >
                  Crear Producto
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Lista de Productos */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Productos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell>{p.marca?.nombre}</TableCell>
                      <TableCell>{p.tipo?.nombre}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleEliminarProducto(p.id)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Agregar Stock */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Agregar Stock
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={stock.productoId}
                    onChange={(e) => setStock({ ...stock, productoId: Number(e.target.value) })}
                    label="Producto"
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {productos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Depósito</InputLabel>
                  <Select
                    value={stock.depositoId}
                    onChange={(e) => setStock({ ...stock, depositoId: Number(e.target.value) })}
                    label="Depósito"
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {depositos.map((d) => (
                      <MenuItem key={d.idDeposito} value={d.idDeposito}>
                        {d.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '20%' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cantidad"
                  value={stock.cantidad}
                  onChange={(e) => setStock({ ...stock, cantidad: Number(e.target.value) })}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '20%' } }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAgregarStock}
                  fullWidth
                  sx={{ height: '100%', minHeight: '56px' }}
                >
                  Agregar Stock
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Listado de Stock */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Stock Actual
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Marca</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Depósito</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockList.map((item) => (
                    <TableRow key={`${item.producto.id}-${item.deposito.idDeposito}`}>
                      <TableCell>{item.producto.nombre}</TableCell>
                      <TableCell>{item.producto.marca?.nombre}</TableCell>
                      <TableCell>{item.producto.tipo?.nombre}</TableCell>
                      <TableCell>{item.deposito.nombre}</TableCell>
                      <TableCell align="right">{item.cantidad}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleEliminarStock(item.producto.id, item.deposito.idDeposito)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Egresos */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Registrar Egreso
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={nuevoEgreso.productoId}
                    onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, productoId: Number(e.target.value) })}
                    label="Producto"
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {productos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Depósito</InputLabel>
                  <Select
                    value={nuevoEgreso.depositoId}
                    onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, depositoId: Number(e.target.value) })}
                    label="Depósito"
                  >
                    <MenuItem value={0}>Seleccionar</MenuItem>
                    {depositos.map((d) => (
                      <MenuItem key={d.idDeposito} value={d.idDeposito}>
                        {d.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Cantidad"
                  value={nuevoEgreso.cantidad}
                  onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, cantidad: Number(e.target.value) })}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha"
                  value={nuevoEgreso.fechaEgreso}
                  onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, fechaEgreso: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <FormControl fullWidth>
                  <InputLabel>Destino</InputLabel>
                  <Select
                    value={nuevoEgreso.destinoTipo}
                    onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, destinoTipo: e.target.value as 'OFICINA'|'VEHICULO' })}
                    label="Destino"
                  >
                    <MenuItem value={'OFICINA'}>Oficina</MenuItem>
                    <MenuItem value={'VEHICULO'}>Vehículo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {nuevoEgreso.destinoTipo === 'VEHICULO' && (
                <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                  <FormControl fullWidth>
                    <InputLabel>Vehículo</InputLabel>
                    <Select
                      value={nuevoEgreso.idVehiculo}
                      onChange={(e) => setNuevoEgreso({ ...nuevoEgreso, idVehiculo: Number(e.target.value) })}
                      label="Vehículo"
                    >
                      <MenuItem value={0}>Seleccionar</MenuItem>
                      {vehiculos.map((v) => (
                        <MenuItem key={v.idVehiculo} value={v.idVehiculo}>
                          {v.dominio}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '15%' } }}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleCrearEgreso}
                  fullWidth
                  sx={{ height: '100%', minHeight: '56px' }}
                >
                  Registrar Egreso
                </Button>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Egresos registrados
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Depósito</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Destino</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {egresos.map((e) => (
                    <TableRow key={e.idStockEgreso}>
                      <TableCell>{e.idStockEgreso}</TableCell>
                      <TableCell>{e.producto?.nombre}</TableCell>
                      <TableCell>{e.deposito?.nombre}</TableCell>
                      <TableCell>{e.cantidad}</TableCell>
                      <TableCell>{e.fechaEgreso}</TableCell>
                      <TableCell>
                        {e.destinoTipo}
                        {e.vehiculo ? ` - ${e.vehiculo.dominio}` : ''}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleEliminarEgreso(e.idStockEgreso)}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Snackbar para mensajes */}
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
