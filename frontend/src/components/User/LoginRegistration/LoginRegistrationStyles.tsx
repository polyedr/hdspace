import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    rightContainer: {
      color: 'rgb(53, 67, 89)',
      paddingTop: 30,
    },
    resizableImg: {
      textAlign: 'center',
      marginBottom: 20,
      '& img': {
        maxWidth: '100%',
      },
    },
    alertText: {
      '&::first-letter': {
        textTransform: 'uppercase',
      },
      margin: 0,
      fontSize: 14,
    },
    button: {
      height: 54,
      fontSize: '20px !important',
      color: 'white !important',
    },
    // input: {
    //   background: '#dee4f0',
    //   borderRadius: 45,
    //   fontSize: 20,
    //   color: 'rgb(122, 123, 123)',
    //   margin: '7px 0',
    //   width: 428,
    //   height: 62,
    //   justifyContent: 'center',
    //   paddingLeft: 23,
    // },
    formContainer: {
      flex: 1,
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    underLogoText: {
      fontSize: '27px !important',
      textAlign: 'center',
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
      // margin: '1em 0',
    },
  }),
);
export default useStyles;
