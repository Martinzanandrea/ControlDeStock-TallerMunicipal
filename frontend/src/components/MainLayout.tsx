import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Container, useMediaQuery, useTheme, IconButton, Tooltip, Divider, Drawer, List, ListItemButton, ListItemText, Switch, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { ColorModeContext } from '../theme';

interface MainLayoutProps { onLogout?: () => void }

// Layout principal autenticado: barra superior + menú lateral responsive
// Contiene navegación a módulos y footer con autor. Maneja toggle de tema.

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const colorMode = React.useContext(ColorModeContext);
  const isDark = theme.palette.mode === 'dark';

  // Menú móvil controlado por drawer (en desktop se muestran botones inline)

  const menuItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    { label: 'Stock', to: '/stock' },
    { label: 'Egresos', to: '/egresos' },
    { label: 'Vehículos', to: '/vehiculos' },
    { label: 'Depósitos', to: '/depositos' },
    { label: 'Auditoría', to: '/auditoria' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default, display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={4}>
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: .5, color: 'inherit', textDecoration: 'none' }}
          >
            Taller Municipal
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map(mi => (
                <Button key={mi.to} component={Link} to={mi.to} color="inherit" sx={{ fontWeight: 500 }}>
                  {mi.label}
                </Button>
              ))}
            </Box>
          )}
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
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
          <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Inventory2OutlinedIcon />
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
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 }, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ textAlign:'center', py:2, fontSize:12, opacity:.7, display:'flex', flexDirection:'column', gap:0.5 }}>
        <span>© {new Date().getFullYear()} Taller Municipal - Sistema de Stock</span>
        <span>Desarrollado por Martin Zanandrea</span>
      </Box>
    </Box>
  );
};

export default MainLayout;
