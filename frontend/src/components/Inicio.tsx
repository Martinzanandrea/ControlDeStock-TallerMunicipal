import React from 'react';
import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import OutputRoundedIcon from '@mui/icons-material/OutputRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';

// Lista de características destacadas para mostrar en el grid
const features = [
  {
    icon: <Inventory2RoundedIcon fontSize="large" />,
    title: 'Control de Stock',
    desc: 'Gestión de existencias por producto, tipo y depósito con validaciones de ingreso/egreso.',
  },
  {
    icon: <LocalShippingRoundedIcon fontSize="large" />,
    title: 'Depósitos y Vehículos',
    desc: 'Alta y administración de depósitos y vehículos destino de egresos.',
  },
  {
    icon: <CategoryRoundedIcon fontSize="large" />,
    title: 'Productos y Tipos',
    desc: 'ABM de productos, marcas y tipos con estado lógico (soft delete).',
  },
  {
    icon: <OutputRoundedIcon fontSize="large" />,
    title: 'Egresos Validados',
    desc: 'Evita egresos con stock insuficiente y fechas futuras.',
  },
  {
    icon: <DownloadRoundedIcon fontSize="large" />,
    title: 'Exportación Excel',
    desc: 'Descarga reportes en XLSX para análisis o auditoría externa.',
  },
  {
    icon: <PictureAsPdfRoundedIcon fontSize="large" />,
    title: 'Exportación PDF',
    desc: 'Generación de PDFs listos para compartir o archivar.',
  },
  {
    icon: <HistoryRoundedIcon fontSize="large" />,
    title: 'Auditoría',
    desc: 'Registro de usuario, fecha/hora y acción realizada.',
  },
  {
    icon: <SecurityRoundedIcon fontSize="large" />,
    title: 'Autenticación JWT',
    desc: 'Acceso protegido y controlado por roles en el backend.',
  },
];

// Landing pública: hero + grid de features + footer de contacto
const Inicio: React.FC = () => {
  const navigate = useNavigate();
  const authed = isAuthenticated();

  return (
    <Box>
  {/* Sección principal (Hero) */}
      <Box
        sx={(theme) => ({
          py: { xs: 8, md: 12 },
          color: 'common.white',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(21,101,192,0.5) 0%, rgba(106,27,154,0.4) 100%)'
            : 'linear-gradient(180deg, rgba(21,101,192,0.85) 0%, rgba(106,27,154,0.85) 100%)',
        })}
      >
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Chip label="Proyecto de Admisión" color="secondary" size="small" />
            <Typography variant="h3" fontWeight={800}>
              Control de Stock en Taller Municipal
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Aplicación full‑stack para gestionar productos, depósitos y egresos con
              auditoría, exportaciones y autenticación segura.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(authed ? '/productos' : '/login')}
              >
                {authed ? 'Entrar al sistema' : 'Iniciar sesión'}
              </Button>
              {!authed && (
                <Button variant="outlined" color="inherit" onClick={() => navigate('/register')}>
                  Crear cuenta
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

  {/* Grid de características */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(4, 1fr)',
            },
          }}
        >
          {features.map((f, i) => (
            <Paper key={i} elevation={3} sx={{ p: 3, height: '100%' }}>
              <Stack spacing={1.5} alignItems="flex-start">
                <Box color="primary.main">{f.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.desc}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Box>
      </Container>

  {/* Footer con tecnologías y contactos */}
      <Box sx={{ py: 6, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
        <Container>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Hecho con React + Vite + Material UI en el frontend y NestJS + PostgreSQL en el backend.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Button
                variant="outlined"
                color="primary"
                component="a"
                href="mailto:martinzanandrea09@gmail.com"
              >
                Contáctame: martinzanandrea09@gmail.com
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                component="a"
                href="tel:+543454471012"
              >
                Tel: 3454471012
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Inicio;
