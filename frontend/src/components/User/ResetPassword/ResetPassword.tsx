import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Form } from 'react-final-form';
import { FormField } from '../FormField/FormField';
import * as Actions from '../../../redux/user/actions';
import { DEFAULT_RESPONSE_ERROR } from '../../../constants/defaultParams';
import isLatinOrNumbers from '../../../shared/validators/isLatinOrNumbers';
import { AppReduxState } from '../../../shared/types/app';
import { Info } from '../Info';
import Spinner from '../../UI/Spinner';
import { AuthError } from '../../../redux/user/types';
import {
  composeValidators,
  isLongPassword,
  isOnlyNumeric,
  isRequired,
} from '../../../shared/validators';
import Button from '../../UI/Button';

const styles = require('./ResetPassword.scss');

type FormData = {
  newPassword: string;
  reNewPassword: string;
};

const mapState = ({ user: { isLoading, authError } }: AppReduxState) => ({
  isLoading,
  authError,
});

const mapDispatch = {
  setApiResponseError: Actions.setAuthError,
  resetPasswordConfirmation: Actions.resetPasswordConfirmation,
};

type IProps = typeof mapDispatch & {
  authError: AuthError;
  isSignLoader: boolean;
};

const ResetPassword: React.FC<IProps> = ({
  resetPasswordConfirmation,
  isSignLoader,
  authError,
  setApiResponseError,
}) => {
  const match = useRouteMatch<{ params: any }>(
    '/password/reset/confirm/:uid/:token',
  );

  const { uid, token } = (match?.params as unknown) as {
    uid: string;
    token: string;
  };

  const initialValues: FormData = {
    newPassword: '',
    reNewPassword: '',
  };

  useEffect(() => {
    return () => {
      if (authError.data?.errorStatus !== -1) {
        setApiResponseError('', DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [authError, setApiResponseError]);

  const handleFormSubmit = (values: FormData) => {
    if (authError.data?.errorStatus !== -1) {
      setApiResponseError('', DEFAULT_RESPONSE_ERROR);
    }

    resetPasswordConfirmation(
      uid,
      token,
      values.newPassword,
      values.reNewPassword,
    );
  };

  return (
    <>
      <Info />
      <div className="signContainer">
        <div className={styles.formContainer}>
          <p className={styles.title}>Reset your password</p>
          <Form
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            subscription={{ submitError: true, submitting: true }}
            validate={(values) => {
              const errors = {} as FormData;

              if (values.newPassword !== values.reNewPassword) {
                errors.reNewPassword = 'Entered passwords must be identical';
              }
              return errors;
            }}
          >
            {({ handleSubmit, submitError, submitting }) => (
              <form onSubmit={handleSubmit}>
                <FormField
                  name="newPassword"
                  placeholder="New password"
                  label="New password"
                  type="password"
                  validator={composeValidators(
                    isRequired,
                    isLongPassword,
                    isLatinOrNumbers,
                    isOnlyNumeric,
                  )}
                />
                <FormField
                  name="reNewPassword"
                  placeholder="Retype new password"
                  label="Retype new password"
                  type="password"
                  validator={isRequired}
                />
                <div className="signButtonBlock">
                  {!!submitError && (
                    <p className="signAuthorisationErrorText">{submitError}</p>
                  )}
                  {authError.data?.errorStatus !== -1 && (
                    <p className="signAuthorisationErrorText">
                      {authError.data?.errorText}
                    </p>
                  )}
                  <Button
                    className="signSubmitBtn"
                    type="submit"
                    styleType="none"
                    disabled={submitting}
                  >
                    Change password
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </div>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export default connect(mapState, mapDispatch)(ResetPassword);
