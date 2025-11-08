import React, { useEffect, useState } from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Snackbar, Alert, Box, TableSortLabel } from '@mui/material';
import { getDepositos } from '../api';
import type { Deposito } from '../interface';

// Listado de depósitos con ordenamiento.
const Depositos: React.FC = () => {
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [orderBy, setOrderBy] = useState<'id'|'nombre'|'ubicacion'>('id');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const handleRequestSort = (key: typeof orderBy) => {
    if(orderBy===key) setOrder(prev=> prev==='asc'?'desc':'asc'); else { setOrderBy(key); setOrder('asc'); }
  };

  useEffect(() => { cargarDatos(); }, []);

  // Carga la lista de depósitos
  async function cargarDatos() {
    const deps = await getDepositos();
    setDepositos(deps);
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Depósitos</Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={orderBy==='id'?order:undefined}>
                  <TableSortLabel active={orderBy==='id'} direction={orderBy==='id'?order:'asc'} onClick={()=>handleRequestSort('id')}>ID</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy==='nombre'?order:undefined}>
                  <TableSortLabel active={orderBy==='nombre'} direction={orderBy==='nombre'?order:'asc'} onClick={()=>handleRequestSort('nombre')}>Nombre</TableSortLabel>
                </TableCell>
                <TableCell sortDirection={orderBy==='ubicacion'?order:undefined}>
                  <TableSortLabel active={orderBy==='ubicacion'} direction={orderBy==='ubicacion'?order:'asc'} onClick={()=>handleRequestSort('ubicacion')}>Ubicación</TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {depositos.length===0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ fontStyle:'italic', py:4 }}>
                    No hay depósitos cargados.
                  </TableCell>
                </TableRow>
              )}
              {depositos.length>0 && depositos.slice().sort((a,b)=>{
                let va: string|number=''; let vb: string|number='';
                switch(orderBy){
                  case 'id': va = a.idDeposito; vb = b.idDeposito; break;
                  case 'nombre': va = (a.nombre||'').toLowerCase(); vb = (b.nombre||'').toLowerCase(); break;
                  case 'ubicacion': va = (a.ubicacion||'').toLowerCase(); vb = (b.ubicacion||'').toLowerCase(); break;
                }
                if(typeof va === 'number' && typeof vb === 'number') return order==='asc'? va - vb : vb - va;
                return order==='asc'? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
              }).map(d => (
                <TableRow key={d.idDeposito}>
                  <TableCell>{d.idDeposito}</TableCell>
                  <TableCell>{d.nombre}</TableCell>
                  <TableCell>{d.ubicacion}</TableCell>
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

export default Depositos;
