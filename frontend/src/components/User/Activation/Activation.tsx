import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import * as Actions from '../../../redux/user/actions';

import SignInForm from '../SigninForm/SigninForm';
import { DEFAULT_RESPONSE_ERROR } from '../../../constants/defaultParams';
import { AppReduxState } from '../../../shared/types/app';
import Spinner from '../../UI/Spinner';
import { AuthError } from '../../../redux/user/types';
import { Info } from '../Info';

const styles = require('./Activation.scss');

const mapState = ({ user: { isLoading, authError } }: AppReduxState) => ({
  isLoading,
  authError,
});

const mapDispatch = {
  setApiResponseError: Actions.setAuthError,
  activateUser: Actions.activateUser,
};

type IProps = typeof mapDispatch & {
  authError: AuthError;
  isSignLoader: boolean;
};

const Activation: React.FC<IProps> = ({
  activateUser,
  isSignLoader,
  authError,
  setApiResponseError,
}) => {
  const match = useRouteMatch<{ params: any }>('/activate/:uid/:token');

  const { uid, token } = (match?.params as unknown) as {
    uid: string;
    token: string;
  };

  useEffect(() => {
    activateUser(uid, token);
  }, [activateUser]);

  useEffect(() => {
    return () => {
      if (authError.data?.errorStatus !== -1) {
        setApiResponseError('', DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [authError, setApiResponseError]);

  return (
    <>
      <Info />
      <div className="signContainer">
        <div className={styles.formContainer}>
          <p className={styles.title}>Thanks for registration!</p>
          <SignInForm />
        </div>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export default connect(mapState, mapDispatch)(Activation);
