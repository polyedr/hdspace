/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { NavLink } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import { AppReduxState } from '$shared/types/app';
import { Info } from '$components/User/Info';
import Button from '$components/UI/Button';
import Spinner from '$components/UI/Spinner';
import {
  DEFAULT_RESPONSE_ERROR,
  DEFAULT_SIGNUP_FIELDS,
} from '$constants/defaultParams';
import { user } from '$constants/pathNames';
import * as Actions from '$redux/user/actions';
import { IApiResponseError } from '$redux/user/types';

import { FormField } from '../FormField/FormField';

const styles = require('./SignUp.scss');

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
  sendActivationMail: Actions.sendActivationMail,
  registerWithGoogle: Actions.registerWithGoogle,
};

type IProps = typeof mapDispatchToProps & {
  apiResponseError: IApiResponseError;
  isSignLoader: boolean;
};

const UnconnectedSignUp: React.FunctionComponent<IProps> = ({
  isSignLoader,
  apiResponseError,
  setApiResponseError,
  sendActivationMail,
  registerWithGoogle,
}) => {
  const handleFormSubmit = (values: FormData) => {
    if (apiResponseError.errorStatus !== -1) {
      setApiResponseError(DEFAULT_RESPONSE_ERROR);
    }

    sendActivationMail(
      values.username,
      values.email,
      values.password,
      values.firstName,
      values.lastName,
    );
  };

  // TODO add google button and this method, when the backend will register new users using google token
  /* const responseGoogle = (response: any) => {
    registerWithGoogle();
    // eslint-disable-next-line no-console
    console.log(response);
  }; */

  const isAccountExist =
    apiResponseError.errorStatus === 400 &&
    (apiResponseError.data.email || apiResponseError.data.username);

  return (
    <>
      <Info />
      <div className="signContainer">
        <div className={styles.formContainer}>
          <p className={styles.signinTitle}>Register your account</p>
          {/* <GoogleLogin
            className={styles.googleLogin}
            clientId="97708805893-kqh3efrnsd7i8nbu30p0mhlvhub029he.apps.googleusercontent.com"
            buttonText="Sign up with google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
            redirectUri="https://staging-26-10.firebaseapp.com/projects"
          /> */}
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
                  {apiResponseError.errorStatus !== -1 && !isAccountExist && (
                    <p className="signAuthorisationErrorText">
                      {apiResponseError.errorText}
                    </p>
                  )}
                  {isAccountExist && (
                    <p className="signAuthorisationErrorText">
                      Looks like you already have an account.
                      <NavLink
                        className={styles.link}
                        to={user.signin}
                        activeClassName="active"
                      >
                        Log in.
                      </NavLink>
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
          <p className={styles.logInText}>
            Already have an account?
            <NavLink
              className={styles.link}
              to={user.signin}
              activeClassName="active"
            >
              Log in.
            </NavLink>
          </p>
        </div>
      </div>
      <Spinner active={isSignLoader} />
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedSignUp);
