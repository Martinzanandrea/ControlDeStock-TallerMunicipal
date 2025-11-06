import React, { useEffect, useState } from 'react';
import { Paper, Box, Typography, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert, TableSortLabel } from '@mui/material';
import { getVehiculos, createVehiculo, deleteVehiculo } from '../api';
import type { Vehiculo } from '../interface';

const Vehiculos: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ dominio: '', modelo: '', anio: new Date().getFullYear() });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });
  const [orderBy, setOrderBy] = useState<'id'|'dominio'|'modelo'|'anio'>('id');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const handleRequestSort = (key: typeof orderBy) => {
    if(orderBy === key) setOrder(prev=> prev==='asc'?'desc':'asc'); else { setOrderBy(key); setOrder('asc'); }
  };

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    const vehs = await getVehiculos();
    setVehiculos(vehs);
  }

  async function handleRegistrarVehiculo() {
    if (!nuevoVehiculo.dominio || !nuevoVehiculo.modelo || !nuevoVehiculo.anio) {
      setSnackbar({ open: true, message: 'Completar todos los campos', severity: 'error' });
      return;
    }
    try {
      const veh = await createVehiculo(nuevoVehiculo);
      setVehiculos(prev => [...prev, veh]);
      setNuevoVehiculo({ dominio: '', modelo: '', anio: new Date().getFullYear() });
      setSnackbar({ open: true, message: 'Vehículo registrado', severity: 'success' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open: true, message: msg || 'Error al registrar vehículo', severity: 'error' });
    }
  }

  async function handleEliminarVehiculo(id: number) {
    if(!window.confirm('¿Eliminar vehículo?')) return;
    try {
      await deleteVehiculo(id);
      setVehiculos(prev => prev.filter(v => v.idVehiculo !== id));
      setSnackbar({ open:true, message:'Vehículo eliminado', severity:'success' });
    } catch(err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSnackbar({ open:true, message: msg || 'Error al eliminar vehículo', severity:'error' });
    }
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const handleCancelVehiculo = () => {
    setNuevoVehiculo({ dominio: '', modelo: '', anio: new Date().getFullYear() });
    setSnackbar({ open:true, message:'Operación cancelada', severity:'info' });
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Registrar Vehículo</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
          <TextField label="Dominio" value={nuevoVehiculo.dominio} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, dominio: e.target.value })} fullWidth />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
          <TextField label="Modelo" value={nuevoVehiculo.modelo} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })} fullWidth />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: '45%', md: '30%' } }}>
          <TextField label="Año" type="number" value={nuevoVehiculo.anio} onChange={e => setNuevoVehiculo({ ...nuevoVehiculo, anio: Number(e.target.value) })} fullWidth />
        </Box>
        <Box sx={{ width: '100%', display:'flex', flexDirection:{ xs:'column', sm:'row' }, gap:1 }}>
          <Button variant="contained" color="primary" sx={{ flex:1, minHeight:'46px' }} onClick={handleRegistrarVehiculo}>Registrar Vehículo</Button>
          <Button variant="outlined" color="inherit" sx={{ flex:1, minHeight:'46px' }} onClick={handleCancelVehiculo}>Cancelar</Button>
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Vehículos registrados</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy==='id'?order:undefined}>
                  <TableSortLabel active={orderBy==='id'} direction={orderBy==='id'?order:'asc'} onClick={()=>handleRequestSort('id')}>ID</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy==='dominio'?order:undefined}>
                  <TableSortLabel active={orderBy==='dominio'} direction={orderBy==='dominio'?order:'asc'} onClick={()=>handleRequestSort('dominio')}>Dominio</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy==='modelo'?order:undefined}>
                  <TableSortLabel active={orderBy==='modelo'} direction={orderBy==='modelo'?order:'asc'} onClick={()=>handleRequestSort('modelo')}>Modelo</TableSortLabel>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} sortDirection={orderBy==='anio'?order:undefined}>
                  <TableSortLabel active={orderBy==='anio'} direction={orderBy==='anio'?order:'asc'} onClick={()=>handleRequestSort('anio')}>Año</TableSortLabel>
                </TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehiculos.length===0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontStyle:'italic', py:4 }}>
                    No hay vehículos registrados, registre uno.
                  </TableCell>
                </TableRow>
              )}
              {vehiculos.length>0 && vehiculos.slice().sort((a,b)=>{
                let va: string|number=''; let vb: string|number='';
                switch(orderBy){
                  case 'id': va = a.idVehiculo; vb = b.idVehiculo; break;
                  case 'dominio': va = a.dominio.toLowerCase(); vb = b.dominio.toLowerCase(); break;
                  case 'modelo': va = a.modelo.toLowerCase(); vb = b.modelo.toLowerCase(); break;
                  case 'anio': va = a.anio; vb = b.anio; break;
                }
                if(typeof va === 'number' && typeof vb === 'number') return order==='asc'? va - vb : vb - va;
                return order==='asc'? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
              }).map(v => (
                <TableRow key={v.idVehiculo}>
                  <TableCell>{v.idVehiculo}</TableCell>
                  <TableCell>{v.dominio}</TableCell>
                  <TableCell>{v.modelo}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{v.anio}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="error" size="small" onClick={()=>handleEliminarVehiculo(v.idVehiculo)}>Eliminar</Button>
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

export default Vehiculos;
