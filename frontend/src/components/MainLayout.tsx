import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container, useMediaQuery, useTheme, IconButton, Tooltip, Divider, Drawer, List, ListItemButton, ListItemText, Switch, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../theme';
import logoMuni from '../assets/logo-muni.png';

interface MainLayoutProps { onLogout?: () => void }

// Layout principal autenticado: barra superior + menú lateral responsive
// Contiene navegación a módulos y footer con autor. Maneja toggle de tema.

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const colorMode = React.useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Menú móvil controlado por drawer (en desktop se muestran botones inline)

  const menuItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    { label: 'Ingresos', to: '/stock' },
    { label: 'Egresos', to: '/egresos' },
    { label: 'Vehículos', to: '/vehiculos' },
    { label: 'Depósitos', to: '/depositos' },
    { label: 'Historial', to: '/historial' },
    { label: 'Stock x Depósito', to: '/stock-deposito' },
    { label: 'Auditoría', to: '/auditoria' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={4}>
        <Toolbar sx={{ gap: 1, minHeight: { xs: 64, sm: 70 }, position: 'relative' }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Box component={Link} to="/" aria-label="Ir al inicio" sx={{ display:'flex', alignItems:'center', mr: 2, color: 'inherit', textDecoration: 'none' }}>
            <Box component="img" src={logoMuni} alt="Municipalidad de Concordia" sx={{ height: 32, width: 'auto', display:'block' }} />
          </Box>
          {!isMobile && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: 0,
                height: '100%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              {menuItems.map(mi => (
                <Button
                  key={mi.to}
                  component={Link}
                  to={mi.to}
                  color="inherit"
                  size="small"
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    px: 1.6,
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'inherit'
                    }
                  }}
                >
                  {mi.label}
                </Button>
              ))}
            </Box>
          )}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isDark ? 'Modo claro' : 'Modo oscuro'}>
              <IconButton color="inherit" onClick={colorMode.toggleColorMode} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)' }}>
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            {onLogout && (
              <Tooltip title="Cerrar sesión">
                <IconButton color="inherit" onClick={onLogout} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)' }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
          <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src={logoMuni} alt="Logo" sx={{ height: 22, width: 'auto' }} />
            <Typography variant="subtitle1" fontWeight={700}>Menú</Typography>
          </Box>
          <Divider />
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map(mi => (
              <ListItemButton key={mi.to} component={Link} to={mi.to} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={mi.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <Box sx={{ p:2, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <Typography variant="caption">Modo oscuro</Typography>
            <Switch checked={isDark} onChange={colorMode.toggleColorMode} size="small" />
          </Box>
        </Box>
      </Drawer>
      {/* Título institucional bajo la barra (oculto en Inicio) */}
      {!isHome && (
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, sm: 2.5 }, color: '#000' }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' },
              fontWeight: 700,
              letterSpacing: .4,
              lineHeight: 1.2,
              mb: 0.5,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            Taller Municipal
          </Typography>
        </Box>
      )}
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3.5, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ textAlign:'center', py:3, fontSize:13, opacity:.6, display:'flex', flexDirection:'column', gap:0.5, mt: 'auto' }}>
        <span>© {new Date().getFullYear()} Taller Municipal - Sistema de Stock</span>
        <span>Desarrollado por Martin Zanandrea</span>
      </Box>
    </Box>
  );
};

export default MainLayout;
