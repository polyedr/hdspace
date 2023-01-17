import { createTheme, darken, lighten } from '@mui/material/styles';
declare module '@mui/material/styles' {
  interface Palette {
    link: Palette['primary'];
    panel: Palette['primary'];
  }

  interface PaletteOptions {
    link: Palette['primary'];
    panel: Palette['primary'];
  }
}

export const LEFT_PANEL_WIDTH = 220;
export const LEFT_PANEL_WIDTH_MIN = 64;
export const RIGHT_PANEL_WIDTH = 310;
export const RIGHT_PANEL_WIDTH_MIN = 50;
export const PANEL_TRANSITION_DURATION = 250;

export const theme = createTheme({
  palette: {
    primary: { main: '#5064FF' },
    secondary: { main: 'rgb(26 192 158)' },
    link: {
      main: '#247c9c',
      light: lighten('#247c9c', 0.2),
      dark: darken('#247c9c', 0.2),
      contrastText: '#fff',
    },
    panel: {
      main: '#2f4050',
      light: lighten('#2f4050', 0.05),
      dark: darken('#2f4050', 0.1),
      contrastText: '#fff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          color: 'white',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: 'rgb(26 192 158)',
          },
        },
      },
    },
  },
  breakpoints: {},
  shape: {},
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14,
    body1: {
      fontSize: 14,
    },
  },
  transitions: {},
});
