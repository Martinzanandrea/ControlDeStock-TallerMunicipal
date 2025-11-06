import React from 'react';
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// Contexto para exponer el toggle entre modo claro/oscuro
export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

// Tokens de diseño según el modo seleccionado
function getDesignTokens(mode: 'light' | 'dark'): ThemeOptions {
  const isDark = mode === 'dark';
  return {
    palette: {
      mode,
      primary: { main: isDark ? '#90caf9' : '#1565c0' },
      secondary: { main: isDark ? '#f48fb1' : '#9c27b0' },
      background: {
        default: isDark ? '#121212' : '#f4f6f8',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'system-ui, "Segoe UI", Roboto, Arial',
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'linear-gradient(90deg,#0d47a1,#311b92)'
              : 'linear-gradient(90deg,#1565c0,#6a1b9a)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark
              ? '0 0 0 1px rgba(255,255,255,0.05),0 4px 12px rgba(0,0,0,0.6)'
              : '0 4px 16px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  };
}

// Hook que gestiona el modo (persistido en localStorage)
// y crea el theme de MUI en base a los tokens
export function useColorMode() {
  const [mode, setMode] = React.useState<'light' | 'dark'>(
    (localStorage.getItem('tm_color_mode') as 'light' | 'dark') || 'light',
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light';
          localStorage.setItem('tm_color_mode', next);
          return next;
        });
      },
    }),
    [],
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return { theme, colorMode };
}
