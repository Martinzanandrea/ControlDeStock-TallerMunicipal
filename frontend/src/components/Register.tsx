import React, { useState } from 'react';
import { Box, Paper, TextField, Typography, Button, Alert, Link as MLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { setSession } from '../auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const Register: React.FC<{ onRegistered?: () => void }> = ({ onRegistered }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, nombreCompleto: nombre }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'No se pudo registrar');
      }
      // login automático luego del registro
      const resLogin = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!resLogin.ok) {
        throw new Error('Registrado, pero no se pudo iniciar sesión');
      }
      const data = await resLogin.json();
      setSession(data.access_token, data.user);
      if (onRegistered) onRegistered();
      else navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" mb={2} textAlign="center">Crear cuenta</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creando...' : 'Registrarse'}
          </Button>
          <Typography variant="body2" textAlign="center">
            ¿Ya tenés cuenta?{' '}
            <MLink component={Link} to="/login">Iniciar sesión</MLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;