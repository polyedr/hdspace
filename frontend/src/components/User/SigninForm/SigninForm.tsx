import React, { useCallback, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';

import { NavLink } from 'react-router-dom';
import { AppReduxState } from '$shared/types/app';
import { Button } from '$components/UI/Button';
import { Modal } from '$components/UI/Modal';
import {
  DEFAULT_RESPONSE_ERROR,
  DEFAULT_SIGNIN_FIELDS,
} from '$constants/defaultParams';
import * as Actions from '$redux/user/actions';
import { IApiResponseError } from '$redux/user/types';

import { FormField } from '../FormField/FormField';
import { user } from '$constants/pathNames';

const styles = require('./SignInForm.scss');

type FormData = {
  username: string;
  password: string;
};

const mapState = ({ user: { apiResponseError } }: AppReduxState) => ({
  apiResponseError,
});

const mapDispatch = {
  restorePassword: Actions.restorePassword,
  setApiResponseError: Actions.setApiResponseError,
  login: Actions.login,
};

type IProps = typeof mapDispatch & {
  apiResponseError: IApiResponseError;
};

const SignInForm = (props: IProps) => {
  const {
    apiResponseError,
    restorePassword,
    setApiResponseError,
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

  const onRestoreEmailFieldChange = useCallback(({ target }) => {
    setRestoreEmail(target.value);
  }, []);

  const handleConfirmPasswordRestore = useCallback(
    (event) => {
      event.preventDefault();

      setIsRestoreEmailSend(true);

      /* restorePassword(restoreEmail);
      closeModal(); */
    },
    [restoreEmail, restorePassword, closeModal],
  );

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
        <Modal
          animClassName="bubbleAnimation"
          bodyClassName={styles.passwordRestoreModalBody}
          title="Restore password"
          confirmText="Send"
          cancelText="Close"
          onClose={closeModal}
          {...(!isRestoreEmailSend && {
            onConfirm: handleConfirmPasswordRestore,
          })}
        >
          {isRestoreEmailSend ? (
            <p>
              <span>If there&apos;s an account for</span>
              <span>{restoreEmail}</span>
              <span>
                , you will get an email on how to reset your password. Check the
                spam folder, as it may be there. If you&apos;ve used a different
                service for logging in, please contact your administrator to
                reset your password.
              </span>
            </p>
          ) : (
            <>
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
            </>
          )}
        </Modal>
      )}
    </>
  );
};

const Component = connect(mapState, mapDispatch)(SignInForm);

export { Component as SignInForm };
