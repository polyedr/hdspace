import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { AppReduxState } from '$shared/types/app';
import { Info } from '$components/User/Info';
import { DEFAULT_RESPONSE_ERROR } from '$constants/defaultParams';
import * as Actions from '$redux/user/actions';
import { IApiResponseError } from '$redux/user/types';
import { Spinner } from '$components/UI/Spinner';

import { SignInForm } from '../SigninForm/SigninForm';

const styles = require('./SignIn.scss');

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader, showConfirmMessage },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
  showConfirmMessage,
});

const mapDispatchToProps = {
  setApiResponseError: Actions.setApiResponseError,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
  showConfirmMessage: boolean;
};

export const UnmountedSignIn: React.FC<IProps> = ({
  apiResponseError,
  isSignLoader,
  setApiResponseError,
  showConfirmMessage,
}) => {
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
          {showConfirmMessage && (
            <p className="signAuthorisationErrorText">
              Please, check your mail and confirm registration
            </p>
          )}
          <SignInForm />
        </div>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export const SignIn = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnmountedSignIn);
