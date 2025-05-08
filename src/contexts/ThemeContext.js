import React, { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
});

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'dark'; // Default to dark mode for the Netflix theme
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: {
                  main: '#3F51B5',
                  light: '#757de8',
                  dark: '#303f9f',
                  contrastText: '#FFFFFF',
                },
                secondary: {
                  main: '#FF4081',
                  light: '#ff79b0',
                  dark: '#c60055',
                  contrastText: '#FFFFFF',
                },
                background: {
                  default: '#F9F9F9',
                  paper: '#FFFFFF',
                },
                text: {
                  primary: '#212121',
                  secondary: '#757575',
                },
                divider: 'rgba(0, 0, 0, 0.12)',
              }
            : {
                // Dark mode palette
                primary: {
                  main: '#90CAF9',
                  light: '#e3f2fd',
                  dark: '#42a5f5',
                  contrastText: '#121212',
                },
                secondary: {
                  main: '#F48FB1',
                  light: '#ffc1e3',
                  dark: '#bf5f82',
                  contrastText: '#121212',
                },
                background: {
                  default: '#121212',
                  paper: '#1E1E1E',
                },
                text: {
                  primary: '#FFFFFF',
                  secondary: '#B3B3B3',
                },
                divider: 'rgba(255, 255, 255, 0.12)',
                error: {
                  main: '#CF6679',
                },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 700,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 4,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 4,
                textTransform: 'none',
                ...(mode === 'dark' && {
                  '&.MuiButton-contained': {
                    backgroundColor: '#90CAF9',
                    color: '#121212',
                    '&:hover': {
                      backgroundColor: '#42a5f5',
                    },
                  },
                }),
                ...(mode === 'light' && {
                  '&.MuiButton-contained': {
                    backgroundColor: '#3F51B5',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#303f9f',
                    },
                  },
                }),
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                ...(mode === 'dark' && {
                  backgroundColor: '#1E1E1E',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                }),
                ...(mode === 'light' && {
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }),
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                ...(mode === 'dark' && {
                  backgroundColor: '#121212',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                }),
                ...(mode === 'light' && {
                  backgroundColor: '#3F51B5',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }),
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}; 