import React from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Form } from 'react-final-form';
import FormField from '../FormField/FormField';
import * as Actions from '../../../redux/user/actions';
import isLatinOrNumbers from '../../../utils/validators/isLatinOrNumbers';
import { Info } from '../Info';
import Spinner from '../../UI/Spinner';
import {
  composeValidators,
  isLongPassword,
  isOnlyNumeric,
  isRequired,
} from '../../../utils/validators';
import Button from '../../UI/Button';
import { AppReduxState } from '../../../types';

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
  resetPasswordConfirmation: Actions.resetPasswordConfirmation,
};

type IProps = typeof mapDispatch & {
  authError: Error | null;
  isSignLoader: boolean;
};

const ResetPassword: React.FC<IProps> = ({
  resetPasswordConfirmation,
  isSignLoader,
  authError,
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

  const handleFormSubmit = (values: FormData) => {
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

      <div>
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
                  {!!submitError && <p>{submitError}</p>}
                  {authError && <p>{authError.message}</p>}
                  <Button type="submit" styleType="none" disabled={submitting}>
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
