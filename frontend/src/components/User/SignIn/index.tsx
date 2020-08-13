import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';

import { AppReduxState } from '$shared/types/app';
import { Info } from '$components/User/Info';
import { Button } from '$components/UI/Button';
import { Modal } from '$components/UI/Modal';
import { DEFAULT_RESPONSE_ERROR } from '$constants/defaultParams';
import * as Actions from '$redux/user/actions';
import { IApiResponseError } from '$redux/user/reducer';
import { Spinner } from '$components/UI/Spinner';
import {
  composeValidators,
  isValidEmail,
  isRequired,
  isLongPassword,
} from '$shared/validators';

import { FormField } from '../FormField/FormField';

const styles = require('./SignIn.scss');

type FormData = {
  username: string;
  password: string;
};

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
});

const mapDispatchToProps = {
  restorePassword: Actions.restorePassword,
  getTokenPair: Actions.getTokenPair,
  setApiResponseError: Actions.setApiResponseError,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

export const UnmountedSignIn: React.FC<IProps> = ({
  apiResponseError,
  isSignLoader,
  restorePassword,
  getTokenPair,
  setApiResponseError,
}) => {
  const [isRestorePasswordModalOpen, setIsRestorePasswordModalOpen] = useState<
    boolean
  >(false);

  const [restoreEmail, setRestoreEmail] = useState<string>('');

  const initialValues: FormData = {
    username: '',
    password: '',
  };

  useEffect(() => {
    return () => {
      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [apiResponseError, setApiResponseError]);

  const closeModal = useCallback(() => {
    setRestoreEmail('');
    setIsRestorePasswordModalOpen(!isRestorePasswordModalOpen);
  }, [isRestorePasswordModalOpen]);

  const handleFormSubmit = (values: FormData) => {
    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    getTokenPair(values.username, values.password);
  };

  const emailValidator = composeValidators(isRequired, isValidEmail);

  const handleRestorePasswordBtn = useCallback(
    (event) => {
      event.preventDefault();

      setIsRestorePasswordModalOpen(!isRestorePasswordModalOpen);
    },
    [isRestorePasswordModalOpen],
  );

  const onRestoreEmailFieldChange = useCallback(({ target }) => {
    setRestoreEmail(target.value);
  }, []);

  const handleConfirmPasswordRestore = useCallback(
    (event) => {
      event.preventDefault();

      restorePassword(restoreEmail);
      closeModal();
    },
    [restoreEmail, restorePassword, closeModal],
  );

  return (
    <>
      <Info isSignUp />
      <div className="signContainer">
        <Form
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          subscription={{ submitError: true, submitting: true }}
        >
          {({ handleSubmit, submitError, submitting }) => (
            <form onSubmit={handleSubmit}>
              <p className={styles.signinTitle}>Login to your account</p>
              <FormField
                name="username"
                placeholder="Username"
                label="Username"
                validator={emailValidator}
              />
              <FormField
                name="password"
                placeholder="Password"
                label="Password"
                validator={isRequired}
              />
              <div className="signButtonBlock">
                {!!submitError && (
                  <p className="signAuthorisationErrorText">{submitError}</p>
                )}
                {apiResponseError.errorStatus !== -1 && (
                  <p className="signAuthorisationErrorText">
                    {apiResponseError.errorText}
                  </p>
                )}
                <Button
                  className="signSubmitBtn"
                  type="submit"
                  styleType="none"
                  disabled={submitting}
                >
                  Login
                </Button>
                <Button
                  className={styles.signinLink}
                  styleType="none"
                  onClick={handleRestorePasswordBtn}
                >
                  Forgot password?
                </Button>
              </div>
            </form>
          )}
        </Form>
      </div>
      {isRestorePasswordModalOpen && (
        <Modal
          animClassName="bubbleAnimation"
          bodyClassName={styles.passwordRestoreModalBody}
          title="Restore password"
          confirmText="Send"
          cancelText="Close"
          onClose={closeModal}
          onConfirm={handleConfirmPasswordRestore}
        >
          <p>Please, enter your email adress.</p>
          <input
            className="modalTextInput"
            type="email"
            name="restore_email"
            id="restore_email"
            placeholder="example@gmail.com"
            value={restoreEmail}
            onChange={onRestoreEmailFieldChange}
          />
        </Modal>
      )}
      <Spinner active={isSignLoader} />
    </>
  );
};

export const SignIn = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnmountedSignIn);
