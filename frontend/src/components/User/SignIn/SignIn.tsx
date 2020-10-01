import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import SignInForm from '../SigninForm/SigninForm';
import Spinner from '../../UI/Spinner';
import { Info } from '../Info';
import {
  selectConfirmMessage,
  selectIsUserLoading,
} from '../../../redux/user/selectors';

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
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    error: {
      marginBottom: 15,
      color: 'red',
    },
  }),
);

const SignIn: React.FC = () => {
  const classes = useStyles();
  const isLoading = useSelector(selectIsUserLoading);
  const confirmMessage = useSelector(selectConfirmMessage);

  return (
    <div className={classes.root}>
      <Info />

      <div className={classes.formContainer}>
        {confirmMessage && <p className={classes.error}>{confirmMessage}</p>}

        <SignInForm />
      </div>

      <Spinner active={isLoading} />
    </div>
  );
};

export default SignIn;
