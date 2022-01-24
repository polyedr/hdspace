import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    rightContainer: {
      color: 'rgb(53, 67, 89)',
    },
    containerCenter: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    resizableImg: {
      minHeight: 10,
    },
    alertText: {
      '&::first-letter': {
        textTransform: 'uppercase',
      },
      margin: 0,
      fontSize: 14,
    },
    button: {
      background: theme.palette.secondary.main,
      width: 428,
      height: 62,
      margin: '17px 0 19px 0',
      borderRadius: 45,
      fontSize: 20,
      textTransform: 'uppercase',
      lineHeight: '1.2',
    },
    input: {
      background: '#dee4f0',
      borderRadius: 45,
      fontSize: 20,
      color: 'rgb(122, 123, 123)',
      margin: '7px 0',
      width: 428,
      height: 62,
      justifyContent: 'center',
      paddingLeft: 23,
    },
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    underLogoText: {
      fontSize: 27,
      marginTop: 20,
    },
    underFormText: {
      fontSize: 18,
    },
    subtext: {
      fontSize: 18,
      textAlign: 'center',
    },
    link: {
      '&, &:active, &:visited, &:focus': {
        color: theme.palette.primary.main,
        marginLeft: 5,
      },
    },
    error: {
      marginTop: '1em',
      minHeight: '5em',
    },
    errorText: {
      color: '#C35A54',
    },
    text: {
      fontSize: '1.25rem',
    },
    main: {
      maxWidth: 410,
      textAlign: 'center',
    },
    info: {
      minHeight: '5em',
      margin: '1em 0',
    },
  }),
);
export default useStyles;
