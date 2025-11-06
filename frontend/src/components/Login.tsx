import React, { useState } from 'react';
import { Box, Paper, TextField, Typography, Button, Alert, Link as MLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { setSession } from '../auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const Login: React.FC<{ onLogged: () => void }> = ({ onLogged }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Error de autenticación');
      }
      const data = await res.json();
      setSession(data.access_token, data.user);
      onLogged();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" mb={2} textAlign="center">Iniciar Sesión</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={submit} display="flex" flexDirection="column" gap={2}>
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
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Ingresando...' : 'Entrar'}
          </Button>
          <Typography variant="body2" textAlign="center">
            ¿No tenés cuenta?{' '}
            <MLink component={Link} to="/register">Registrate</MLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;