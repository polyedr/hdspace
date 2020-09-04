import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import * as Actions from '../../../redux/user/actions';

import SignInForm from '../SigninForm/SigninForm';
import { DEFAULT_RESPONSE_ERROR } from '../../../constants/defaultParams';
import { AppReduxState } from '../../../shared/types/app';
import Spinner from '../../UI/Spinner';
import { IApiResponseError } from '../../../redux/user/types';
import { Info } from '../Info';

const styles = require('./SignIn.scss');

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
          {confirmMessage && (
            <p className="signAuthorisationErrorText">{confirmMessage}</p>
          )}
          <SignInForm />
        </div>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UnmountedSignIn);
