import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import * as Actions from '../../../redux/user/actions';
import LoginForm from '../LoginForm';
import Spinner from '../../UI/Spinner';
import { Info } from '../Info';
import { AppReduxState } from '../../../types';

const useStyles = makeStyles((theme) =>
  createStyles({
    activation: {
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
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontWeight: 600,
    },
  }),
);

const mapState = ({ user: { isLoading, authError } }: AppReduxState) => ({
  isLoading,
  authError,
});

const mapDispatch = {
  activateUser: Actions.activateUser,
};

type IProps = typeof mapDispatch & {
  isSignLoader: boolean;
};

const Activation: React.FC<IProps> = ({ activateUser, isSignLoader }) => {
  const classes = useStyles();
  const match = useRouteMatch<{ params: any }>('/activate/:uid/:token');

  const { uid, token } = (match?.params as unknown) as {
    uid: string;
    token: string;
  };

  useEffect(() => {
    activateUser(uid, token);
  }, [activateUser]);

  return (
    <div className={classes.activation}>
      <Info />

      <div className={classes.formContainer}>
        <div className={classes.info}>
          <p className={classes.title}>Thanks for registration!</p>
        </div>

        <LoginForm />
      </div>
      <Spinner active={isSignLoader} />
    </div>
  );
};

export default connect(mapState, mapDispatch)(Activation);
