/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as Actions from '@Redux/user/actions';
import { AppReduxState } from '@Redux/types';
import Alert from '@mui/lab/Alert';
import { selectConfirmMessage } from '@Redux/user/selectors';
import LoginForm from '../LoginForm';
import Spinner from '../../UI/Spinner';
import Info from '../Info';
import bigimg from '../../../assets/images/bigimg3.png';
import useStyles from '../LoginRegistration/LoginRegistrationStyles';

const mapState = ({ user: { isLoading, error } }: AppReduxState) => ({
  isLoading,
  error,
});

const mapDispatch = {
  activateUser: Actions.activateUser,
};

type IProps = typeof mapDispatch & {
  isSignLoader: boolean;
};

const Activation: React.FC<IProps> = ({ activateUser, isSignLoader }) => {
  const classes = useStyles();
  const confirmMessage = useSelector(selectConfirmMessage);
  const match = useRouteMatch<{ params: any }>('/activate/:uid/:token');

  const { uid, token } = match?.params as unknown as {
    uid: string;
    token: string;
  };

  useEffect(() => {
    activateUser(uid, token);
  }, [activateUser, token, uid]);

  return (
    <div className={classes.root}>
      <Info
        title="Did you know?"
        list={[
          'Our AI system recognizes Graphical User Interfaces (GUIs) including separate elements with color and layout patterns.',
          'You can add ready-made templates or draw your own drawing: our AI system will recognize and include it  in your project.',
        ]}
        img={bigimg}
      />

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
      <Spinner active={isSignLoader} />
    </div>
  );
};

export default connect(mapState, mapDispatch)(Activation);
