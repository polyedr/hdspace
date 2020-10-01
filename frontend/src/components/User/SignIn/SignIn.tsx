import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import * as Actions from '../../../redux/user/actions';

import SignInForm from '../SigninForm/SigninForm';
import { DEFAULT_RESPONSE_ERROR } from '../../../constants/defaultParams';
import { AppReduxState } from '../../../shared/types/app';
import Spinner from '../../UI/Spinner';
import { IApiResponseError } from '../../../redux/user/types';
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

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader, confirmMessage },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
  confirmMessage,
});

const mapDispatchToProps = {
  setApiResponseError: Actions.setApiResponseError,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
  confirmMessage: string;
};

export const UnmountedSignIn: React.FC<IProps> = ({
  apiResponseError,
  isSignLoader,
  setApiResponseError,
  confirmMessage,
}) => {
  const classes = useStyles();

  useEffect(() => {
    return () => {
      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [apiResponseError, setApiResponseError]);

  return (
    <div className={classes.root}>
      <Info />
      <div className={classes.formContainer}>
        {confirmMessage && <p className={classes.error}>{confirmMessage}</p>}
        <SignInForm />
      </div>
      <Spinner active={isSignLoader} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UnmountedSignIn);
