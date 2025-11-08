import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Chip, Stack } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { getToken } from '../auth';

// Datos de auditoría devueltos por el backend
type AuditDTO = {
  id: number;
  createdAt: string;
  username: string | null;
  userId: number | null;
  method: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | string;
  resource: string | null;
};

// Nombre legible del recurso
function getNombreRecurso(resource: string | null): string {
  if (!resource) return 'registro';
  const map: Record<string, string> = {
    productos: 'producto',
    productostipos: 'tipo de producto',
    productomarca: 'marca',
    depositos: 'depósito',
    vehiculos: 'vehículo',
    stockingresado: 'ingreso de stock',
    stockegreso: 'egreso de stock',
    auditoria: 'auditoría',
  };
  return map[resource.toLowerCase()] || resource;
}

// Texto descriptivo de la acción
function getDescripcionAccion(action: string, resource: string | null): string {
  const nombre = getNombreRecurso(resource);
  switch (action) {
    case 'CREATE':
      return `Creó un ${nombre}`;
    case 'UPDATE':
      return `Actualizó un ${nombre}`;
    case 'DELETE':
      return `Eliminó un ${nombre}`;
    default:
      return `${action} en ${nombre}`;
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Lista de operaciones recientes
const Auditoria: React.FC = () => {
  const [items, setItems] = useState<AuditDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const token = getToken();
    fetch(`${API_URL}/auditoria?limit=100`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((raw) => {
        const data = raw as AuditDTO[];
  // Solo acciones de escritura
        const escritura = data.filter((d) => 
          ['CREATE', 'UPDATE', 'DELETE'].includes(d.action)
        );
        setItems(
          escritura.map((d) => ({
            id: d.id,
            createdAt: d.createdAt,
            username: d.username ?? null,
            userId: typeof d.userId === 'number' ? d.userId : null,
            method: d.method,
            action: d.action,
            resource: d.resource ?? null,
          })),
        );
      })
      .catch((e) => {
  // Ignora abort
        if (e instanceof Error && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : String(e));
      });
    return () => controller.abort();
  }, []);

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>Auditoría (últimos 100)</Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer>
          <Table size="small" sx={{ minWidth: 360 }}>
            <TableHead>
              <TableRow>
                <TableCell>Hora</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3, fontStyle: 'italic' }}>
                    Sin registros aún.
                  </TableCell>
                </TableRow>
              )}
              {items.map((it) => {
                const fecha = new Date(it.createdAt);
                const hora = fecha.toLocaleString();
                const usuario = it.username || (it.userId ? `Usuario #${it.userId}` : 'Anónimo');
                const descripcion = getDescripcionAccion(it.action, it.resource);
                let color: ChipProps['color'] = 'default';
                if (it.action === 'CREATE') color = 'success';
                else if (it.action === 'UPDATE') color = 'warning';
                else if (it.action === 'DELETE') color = 'error';
                return (
                  <TableRow key={it.id}>
                    <TableCell>{hora}</TableCell>
                    <TableCell>{usuario}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip size="small" label={it.action} color={color} variant="filled" />
                        <Typography variant="body2">{descripcion}</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default Auditoria;
