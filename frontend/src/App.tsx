import React from 'react';
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import Dashboard from './pages/Dashboard';

// Create a professional theme for the stock trading system
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Professional blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // Accent red for alerts
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50', // Green for positive price changes
    },
    warning: {
      main: '#ff9800', // Orange for restricted stocks
    },
    error: {
      main: '#f44336', // Red for suspended stocks
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* App Header */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <TrendingUp sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              HNX Stock Tracking System
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Hệ thống theo dõi chứng khoán HNX
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Dashboard />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
