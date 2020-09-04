/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';

import { NavLink } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import * as Actions from '../../../redux/user/actions';

import { FormField } from '../FormField/FormField';
import {
  DEFAULT_RESPONSE_ERROR,
  DEFAULT_SIGNIN_FIELDS,
} from '../../../constants/defaultParams';
import { AppReduxState } from '../../../shared/types/app';
import { user } from '../../../constants/pathNames';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import {
  composeValidators,
  isRequired,
  isValidEmail,
} from '../../../shared/validators';

const styles = require('./SignInForm.scss');

type FormData = {
  username: string;
  password: string;
};

const mapState = ({ user: { apiResponseError } }: AppReduxState) => ({
  // eslint-disable-next-line react/require-default-props
  apiResponseError,
});

const mapDispatch = {
  setApiResponseError: Actions.setApiResponseError,
  login: Actions.login,
  sendResetPasswordMail: Actions.sendResetPasswordMail,
};

type IProps = typeof mapDispatch & ReturnType<typeof mapState>;

const SignInForm = (props: IProps) => {
  const {
    apiResponseError,
    setApiResponseError,
    sendResetPasswordMail,
    login,
  } = props;

  const [isRestorePasswordModalOpen, setIsRestorePasswordModalOpen] = useState<
    boolean
  >(false);

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
    setIsRestorePasswordModalOpen(!isRestorePasswordModalOpen);
  }, [isRestorePasswordModalOpen]);

  const handleFormSubmit = (values: FormData) => {
    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    login({ username: values.username, password: values.password });
  };

  const handleRestorePasswordBtn = useCallback(
    (event) => {
      event.preventDefault();

      setIsRestorePasswordModalOpen(!isRestorePasswordModalOpen);
    },
    [isRestorePasswordModalOpen],
  );

  const handleConfirmPasswordRestore = (values: { email: string }) => {
    sendResetPasswordMail(values.email);
    closeModal();
  };

  // TODO add google button and this method, when the backend will register new users using google token
  /* const responseGoogle = (response: any) => {
    // eslint-disable-next-line no-console
    console.log(response);
  }; */

  const isEmailHasBeenSend =
    apiResponseError.errorStatus === 401 &&
    apiResponseError.data.detail ===
      'No active account found with the given credentials';

  return (
    <>
      <Form
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        subscription={{ submitError: true, submitting: true }}
      >
        {({ handleSubmit, submitError, submitting }) => (
          <form onSubmit={handleSubmit}>
            <p className={styles.signinTitle}>Login to your account</p>
            {/* <GoogleLogin
              className={styles.googleLogin}
              clientId="97708805893-kqh3efrnsd7i8nbu30p0mhlvhub029he.apps.googleusercontent.com"
              buttonText="Sign in with google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            /> */}
            {DEFAULT_SIGNIN_FIELDS.map(
              ({ name, placeholder, label, type, validator }) => (
                <FormField
                  name={name}
                  placeholder={placeholder}
                  label={label}
                  type={type}
                  validator={validator}
                />
              ),
            )}
            <div className="signButtonBlock">
              {!!submitError && (
                <p className="signAuthorisationErrorText">{submitError}</p>
              )}
              {apiResponseError.errorStatus !== -1 && (
                <p className="signAuthorisationErrorText">
                  {isEmailHasBeenSend
                    ? 'Please, confirm your email'
                    : apiResponseError.errorText}
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
      <p className={styles.logInText}>
        Create an account
        <NavLink
          className={styles.link}
          to={user.signup}
          activeClassName="active"
        >
          for free
        </NavLink>
      </p>
      {isRestorePasswordModalOpen && (
        <Modal
          animClassName="bubbleAnimation"
          bodyClassName={styles.passwordRestoreModalBody}
          title="Restore password"
          onClose={closeModal}
        >
          <Form
            onSubmit={handleConfirmPasswordRestore}
            initialValues={initialValues}
            subscription={{ submitError: true, submitting: true }}
          >
            {({ handleSubmit, submitError, submitting }) => (
              <form onSubmit={handleSubmit}>
                <p>Please, enter your email address.</p>
                <FormField
                  name="email"
                  placeholder="email"
                  type="email"
                  className={styles.modalTextInput}
                  validator={composeValidators(isRequired, isValidEmail)}
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
                </div>
                <div className={styles.modalButtons}>
                  <Button
                    className={styles.closeButton}
                    styleType="secondary"
                    disabled={submitting}
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                  <Button type="submit" onClick={handleConfirmPasswordRestore}>
                    Send
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </Modal>
      )}
    </>
  );
};

export default connect(mapState, mapDispatch)(SignInForm);
