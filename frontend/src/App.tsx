// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import MainLayout from './components/MainLayout';
import Login from './components/Login';
import Register from './components/Register';
import { isAuthenticated, clearSession } from './auth';
import Productos from './components/Productos';
import Stock from './components/Stock';
import Egresos from './components/Egresos';
import Vehiculos from './components/Vehiculos';
import Depositos from './components/Depositos';
import Auditoria from './components/Auditoria.tsx';
import HistorialProducto from './components/HistorialProducto';
import StockProductoDeposito from './components/StockProductoDeposito';
import Inicio from './components/Inicio';
import { ColorModeContext, useColorMode } from './theme';


// Componente raíz: configura tema (modo claro/oscuro),
// enrutamiento y protección de rutas según autenticación.
// Página pública principal: /inicio.
const App: React.FC = () => {
  const { theme, colorMode } = useColorMode();
  const authed = isAuthenticated();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login onLogged={() => window.location.replace('/')} />} />
            <Route path="/register" element={<Register onRegistered={() => window.location.replace('/')} />} />
            {/* Página pública de inicio */}
            <Route path="/inicio" element={<Inicio />} />
            {authed ? (
              <Route path="/" element={<MainLayout onLogout={() => { clearSession(); window.location.replace('/login'); }} />}> 
                <Route index element={<Inicio />} />
                <Route path="productos" element={<Productos />} />
                <Route path="stock" element={<Stock />} />
                <Route path="egresos" element={<Egresos />} />
                <Route path="vehiculos" element={<Vehiculos />} />
                <Route path="depositos" element={<Depositos />} />
                <Route path="auditoria" element={<Auditoria />} />
                <Route path="historial" element={<HistorialProducto />} />
                <Route path="stock-deposito" element={<StockProductoDeposito />} />
              </Route>
            ) : (
              <>
                <Route path="/" element={<Inicio />} />
                {/* Si no autenticado y va a ruta protegida, redirige a login */}
                <Route path="/*" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
