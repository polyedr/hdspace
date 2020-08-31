import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { Info } from '$components/User/Info';
import Spinner from '$components/UI/Spinner';
import * as Actions from '$redux/user/actions';
import { IApiResponseError } from '$redux/user/types';
import { AppReduxState } from '$shared/types/app';
import { DEFAULT_RESPONSE_ERROR } from '$constants/defaultParams';

import SignInForm from '../SigninForm/SigninForm';

const styles = require('./Activation.scss');

const mapState = ({
  user: { isSignLoader, apiResponseError },
}: AppReduxState) => ({
  isSignLoader,
  apiResponseError,
});

const mapDispatch = {
  setApiResponseError: Actions.setApiResponseError,
  activateUser: Actions.activateUser,
};

type IProps = typeof mapDispatch & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

const Activation: React.FC<IProps> = ({
  activateUser,
  isSignLoader,
  apiResponseError,
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
      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [apiResponseError, setApiResponseError]);

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
