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
      primary: { main: isDark ? '#66bb6a' : '#2e7d32' },
      secondary: { main: isDark ? '#4db6ac' : '#00695c' },
      background: {
        default: isDark ? '#0a1929' : '#f5f7fa',
        paper: isDark ? '#1a2027' : '#ffffff',
      },
    },
    shape: { borderRadius: 12 },
    spacing: 8,
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      h4: { fontWeight: 700, fontSize: '2rem' },
      h5: { fontWeight: 700, fontSize: '1.5rem' },
      h6: { fontWeight: 600, fontSize: '1.25rem' },
      button: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark
              ? 'linear-gradient(135deg,#1b5e20,#2e7d32,#00695c)'
              : 'linear-gradient(135deg,#2e7d32,#388e3c,#00695c)',
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.14)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: isDark
              ? '0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 12px rgba(0,0,0,0.08)',
          },
          elevation1: {
            boxShadow: isDark
              ? '0 2px 4px rgba(0,0,0,0.3)'
              : '0 1px 4px rgba(0,0,0,0.06)',
          },
          elevation2: {
            boxShadow: isDark
              ? '0 4px 8px rgba(0,0,0,0.4)'
              : '0 2px 8px rgba(0,0,0,0.08)',
          },
          elevation3: {
            boxShadow: isDark
              ? '0 6px 16px rgba(0,0,0,0.5)'
              : '0 4px 16px rgba(0,0,0,0.10)',
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.95rem',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 12px rgba(102,187,106,0.25)'
                : '0 4px 12px rgba(46,125,50,0.25)',
            },
          },
          sizeLarge: {
            padding: '12px 32px',
            fontSize: '1rem',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 700,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
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
