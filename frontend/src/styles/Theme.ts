import { createMuiTheme, darken, lighten } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    link: Palette['primary'];
  }

  interface PaletteOptions {
    link: Palette['primary'];
  }
}

const theme = createMuiTheme({
  palette: {
    primary: { main: '#51718c' },
    secondary: { main: '#1cc09f' },
    link: {
      main: '#247c9c',
      light: lighten('#247c9c', 0.1),
      dark: darken('#247c9c', 0.1),
      contrastText: '#247c9c',
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
