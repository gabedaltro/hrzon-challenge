import { createTheme } from '@mui/material/styles';

export const horizon = {
  yellow: '#FBE509',
  black: '#000000',
  graphite: '#141414',
  lightGray: '#F7F7F7',
  white: '#FFFFFF',
};

const theme = createTheme({
  palette: {
    primary: {
      main: horizon.graphite,
      contrastText: horizon.white,
    },
    secondary: {
      main: horizon.yellow,
      contrastText: horizon.black,
    },
    background: {
      default: horizon.lightGray,
      paper: horizon.white,
    },
    text: {
      primary: horizon.graphite,
      secondary: '#616161',
    },
    success: {
      main: '#1b7f4d',
    },
    warning: {
      main: '#a86b00',
    },
    error: {
      main: '#b3261e',
    },
  },
  typography: {
    fontFamily: ['Montserrat', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*:focus-visible': {
          outline: `3px solid ${horizon.graphite}`,
          outlineOffset: 2,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
});

export { theme };
