import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';

import { NavLink } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { AppReduxState } from '$shared/types/app';
import { Button } from '$components/UI/Button';
import { Modal } from '$components/UI/Modal';
import {
  DEFAULT_RESPONSE_ERROR,
  DEFAULT_SIGNIN_FIELDS,
} from '$constants/defaultParams';
import * as Actions from '$redux/user/actions';

import { FormField } from '../FormField/FormField';
import { user } from '$constants/pathNames';
import {
  composeValidators,
  isRequired,
  isValidEmail,
} from '$shared/validators';

const styles = require('./SignInForm.scss');

type FormData = {
  username: string;
  password: string;
};

const mapState = ({ user: { apiResponseError } }: AppReduxState) => ({
  apiResponseError,
});

const mapDispatch = {
  // restorePassword: Actions.restorePassword,
  setApiResponseError: Actions.setApiResponseError,
  login: Actions.login,
  sendResetPasswordMail: Actions.sendResetPasswordMail,
};

type IProps = typeof mapDispatch & ReturnType<typeof mapState>;

const SignInForm = (props: IProps) => {
  const {
    apiResponseError,
    // restorePassword,
    setApiResponseError,
    sendResetPasswordMail,
    login,
  } = props;

  const [isRestorePasswordModalOpen, setIsRestorePasswordModalOpen] = useState<
    boolean
  >(false);

  const [restoreEmail, setRestoreEmail] = useState<string>('');
  const [isRestoreEmailSend, setIsRestoreEmailSend] = useState(false);

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

    login({ username: values.username, password: values.password });
  };

  const handleRestorePasswordBtn = useCallback(
    (event) => {
      event.preventDefault();

      setIsRestorePasswordModalOpen(!isRestorePasswordModalOpen);
    },
    [isRestorePasswordModalOpen],
  );

  /* const onRestoreEmailFieldChange = useCallback(({ target }) => {
    setRestoreEmail(target.value);
  }, []); */

  const handleConfirmPasswordRestore = (values: { email: string }) => {
    setIsRestoreEmailSend(true);
    sendResetPasswordMail(values.email);

    // eslint-disable-next-line no-console
    console.log(values);

    /* restorePassword(restoreEmail);
      closeModal(); */
  };

  const responseGoogle = (response: any) => {
    // eslint-disable-next-line no-console
    console.log(response);
  };

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
            <GoogleLogin // TODO make as separate component
              className={styles.googleLogin}
              clientId="97708805893-kqh3efrnsd7i8nbu30p0mhlvhub029he.apps.googleusercontent.com"
              buttonText="Sign in with google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
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
        // TODO reset error and isRestoreEmailSend after closing
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
                  label="email"
                  type="email"
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
                <Button
                  className="signSubmitBtn"
                  styleType="none"
                  disabled={submitting}
                  onClick={closeModal}
                >
                  Close
                </Button>
                <Button
                  className={styles.signinLink}
                  styleType="none"
                  type="submit"
                  onClick={handleConfirmPasswordRestore}
                >
                  Send
                </Button>

                {isRestoreEmailSend ? (
                  <p>
                    <span>If there&apos;s an account for</span>
                    <span>{restoreEmail}</span>
                    <span>
                      , you will get an email on how to reset your password.
                      Check the spam folder, as it may be there. If you&apos;ve
                      used a different service for logging in, please contact
                      your administrator to reset your password.
                    </span>
                  </p>
                ) : (
                  <></>
                )}
              </form>
            )}
          </Form>
        </Modal>
      )}
    </>
  );
};

const Component = connect(mapState, mapDispatch)(SignInForm);

export { Component as SignInForm };
