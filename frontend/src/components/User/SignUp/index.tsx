import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Form } from 'react-final-form';
import { AppReduxState } from '$shared/types/app';
import { Info } from '$components/User/Info';
import { Button } from '$components/UI/Button';
import { Spinner } from '$components/UI/Spinner';
import {
  DEFAULT_RESPONSE_ERROR,
  DEFAULT_SIGNUP_FIELDS,
} from '$constants/defaultParams';
import * as Actions from '$redux/user/actions';
import { IApiResponseError } from '$redux/user/reducer';
import { FormField } from '../FormField/FormField';

type FormData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const initialValues: FormData = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const mapStateToProps = ({
  user: { apiResponseError, isSignLoader },
}: AppReduxState) => ({
  apiResponseError,
  isSignLoader,
});

const mapDispatchToProps = {
  setApiResponseError: Actions.setApiResponseError,
  setNewUser: Actions.setNewUser,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

const UnconnectedSignUp: React.FunctionComponent<IProps> = ({
  isSignLoader,
  apiResponseError,
  setApiResponseError,
  setNewUser,
}) => {
  useEffect(() => {
    return () => {
      if (apiResponseError.errorStatus !== -1) {
        setApiResponseError(DEFAULT_RESPONSE_ERROR);
      }
    };
  }, [apiResponseError, setApiResponseError]);

  const handleFormSubmit = (values: FormData) => {
    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    setNewUser(
      values.username,
      values.email,
      values.firstName,
      values.lastName,
      values.password,
    );
  };

  return (
    <>
      <Info isSignUp={false} />
      <div className="signContainer">
        <Form
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          subscription={{ submitError: true, submitting: true }}
        >
          {({ handleSubmit, submitError, submitting }) => (
            <form onSubmit={handleSubmit}>
              {DEFAULT_SIGNUP_FIELDS.map(
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
                  Sign Up
                </Button>
              </div>
            </form>
          )}
        </Form>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export const SignUp = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnconnectedSignUp);
