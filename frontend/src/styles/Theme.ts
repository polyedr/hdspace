import { createMuiTheme, darken, lighten } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    link: Palette['primary'];
    panel: Palette['primary'];
  }

  interface PaletteOptions {
    link: Palette['primary'];
    panel: Palette['primary'];
  }
}

const theme = createMuiTheme({
  palette: {
    primary: { main: '#51718c' },
    secondary: { main: '#1cc09f' },
    link: {
      main: '#247c9c',
      light: lighten('#247c9c', 0.2),
      dark: darken('#247c9c', 0.2),
      contrastText: '#247c9c',
    },
    panel: {
      main: '#2f4050',
      light: lighten('#2f4050', 0.2),
      dark: darken('#2f4050', 0.2),
      contrastText: '#fff',
    },
  },
  overrides: {
    MuiButton: {
      containedSecondary: {
        color: '#fff',
      },
    },
  },
  breakpoints: {},
  shape: {},
  typography: {},
  transitions: {},
});

export default theme;
