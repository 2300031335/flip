import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f19',
      paper: '#111827',
    },
    primary: {
      main: '#06b6d4', // Vibrant Cyan
      light: '#67e8f9',
      dark: '#0e7490',
    },
    secondary: {
      main: '#8b5cf6', // Electric Violet
    },
    error: {
      main: '#ef4444', // Crimson Red
    },
    warning: {
      main: '#f59e0b', // Amber
    },
    success: {
      main: '#10b981', // Emerald Green
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Outfit', 'sans-serif'].join(','),
    h4: {
      fontFamily: 'Outfit',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'Outfit',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'Outfit',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
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
});

export default darkTheme;
