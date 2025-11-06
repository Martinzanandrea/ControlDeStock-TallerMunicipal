import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Chip, Stack } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import { getToken } from '../auth';

// Estructura mínima que consume el front para mostrar auditoría
type AuditDTO = {
  id: number;
  createdAt: string;
  username: string | null;
  userId: number | null;
  method: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Vista simple de auditoría: muestra hora, usuario y acción
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
        setItems(
          data.map((d) => ({
            id: d.id,
            createdAt: d.createdAt,
            username: d.username ?? null,
            userId: typeof d.userId === 'number' ? d.userId : null,
            method: d.method,
            action: d.action,
          })),
        );
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
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
                <TableCell>Acción</TableCell>
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
                        <Chip size="small" label={it.action} color={color} variant={color === 'default' ? 'outlined' : 'filled'} />
                        <Typography variant="body2" color="text.secondary">{it.method}</Typography>
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
