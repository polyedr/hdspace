import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { selectConfirmMessage } from '@Redux/user/selectors';
import LoginForm from '../LoginForm';
import { Info } from '../Info';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    formContainer: {
      flex: 1,
      backgroundColor: theme.palette.secondary.main,
      color: '#000',
      justifyContent: 'center',
      padding: '4em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    info: {
      minHeight: '5em',
      margin: '1em 0',
    },
  }),
);

const SignIn: React.FC = () => {
  const classes = useStyles();
  const confirmMessage = useSelector(selectConfirmMessage);

  return (
    <div className={classes.root}>
      <Info />

      <div className={classes.formContainer}>
        <div className={classes.info}>
          {confirmMessage && (
            <Alert severity="info" variant="filled">
              {confirmMessage}
            </Alert>
          )}
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default SignIn;
