import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { Form } from 'react-final-form';
import { AppReduxState } from '$shared/types/app';
import { Button } from '$components/UI/Button';
import { Spinner } from '$components/UI/Spinner';
import { openSignScreen } from '$utils/history';
import {
  DEFAULT_RESTORE_PASSWORD_FIELDS,
  DEFAULT_RESPONSE_ERROR,
} from '$constants/defaultParams';
import { IApiResponseError } from '$redux/user/types';
import * as Actions from '$redux/user/actions';

import { FormField } from '../FormField/FormField';

const styles = require('./PasswordRestore.scss');

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
});

const mapDispatchToProps = {
  setApiResponseError: Actions.setApiResponseError,
  setNewPassword: Actions.setNewPassword,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

type FormData = {
  password: string;
  confirmPassword: string;
};

const initialValues: FormData = {
  password: '',
  confirmPassword: '',
};

const UnconnectedPasswordRestore: React.FC<IProps> = ({
  isSignLoader,
  apiResponseError,
  setApiResponseError,
  setNewPassword,
}) => {
  const handleCloseButton = useCallback(() => {
    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    openSignScreen('signin');
  }, [setApiResponseError, apiResponseError]);

  const handleFormSubmit = (values: FormData) => {
    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    setNewPassword(values.password);
  };

  return (
    <div className={styles.restoreContainer}>
      <Form
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        subscription={{ submitError: true, submitting: true }}
        validate={(values: FormData) => {
          const errors = {} as { [key in keyof FormData]: string };

          if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Entered passwords must be identical';
          }
          return errors;
        }}
      >
        {({ handleSubmit, submitError, submitting }) => (
          <form onSubmit={handleSubmit}>
            <p className={styles.signinTitle}>Change your password:</p>
            {DEFAULT_RESTORE_PASSWORD_FIELDS.map(
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
                className={classNames(styles.restoreBtn, 'signSubmitBtn')}
                onClick={handleCloseButton}
              >
                Close
              </Button>
              <Button
                className="signSubmitBtn"
                type="submit"
                styleType="none"
                disabled={submitting}
              >
                Confirm
              </Button>
            </div>
          </form>
        )}
      </Form>
      <Spinner active={isSignLoader} />
    </div>
  );
};

// TODO check confirm buttons disabled if error

export const PasswordRestore = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedPasswordRestore);
