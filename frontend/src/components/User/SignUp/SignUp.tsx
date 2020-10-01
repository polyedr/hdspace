/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-final-form';
import { NavLink } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles, darken } from '@material-ui/core';
import * as Actions from '../../../redux/user/actions';

import { FormField } from '../FormField/FormField';
import { AppReduxState } from '../../../shared/types/app';
import {
  DEFAULT_RESPONSE_ERROR,
  DEFAULT_SIGNUP_FIELDS,
} from '../../../constants/defaultParams';
import Spinner from '../../UI/Spinner';
import { AuthError } from '../../../redux/user/types';
import { user } from '../../../constants/pathNames';
import { Info } from '../Info';
import Button from '../../UI/Button';
import {
  selectAuthError,
  selectIsUserLoading,
} from '../../../redux/user/selectors';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh',
    },
    formContainer: {
      flex: 1,
      backgroundColor: theme.palette.secondary.main,
      color: '#000',
      justifyContent: 'center',
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      flex: 0,
    },
    signinTitle: {
      marginBottom: 30,
      fontSize: 24,
      lineHeight: '36px',
      fontWeight: 600,
    },
    googleLogin: {
      width: '100%',
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signButtonBlock: {
      position: 'relative',
    },
    error: {
      marginBottom: 15,
      color: 'red',
    },
    link: {
      marginLeft: 5,
      color: theme.palette.primary.main,
      textDecoration: 'underline',
      '&:hover': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
      },
    },
    signSubmitBtn: {
      marginBottom: 5,
      padding: '8px 12px',
      backgroundColor: '#fff',
      '& > span': {
        color: theme.palette.primary.main,
      },
      '&:hover, &:focus': {
        backgroundColor: darken('#fff', 0.2),
      },
      '&:active': {
        backgroundColor: darken('#fff', 0.1),
      },
    },
    logInText: {
      marginTop: 20,
    },
  }),
);

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

const mapStateToProps = (state: AppReduxState) => ({
  authError: selectAuthError(state),
  isSignLoader: selectIsUserLoading(state),
});

const mapDispatchToProps = {
  setApiResponseError: Actions.setAuthError,
  sendActivationMail: Actions.sendActivationMail,
  registerWithGoogle: Actions.registerWithGoogle,
};

type IProps = typeof mapDispatchToProps & {
  authError: AuthError;
  isSignLoader: boolean;
};

const UnconnectedSignUp: React.FunctionComponent<IProps> = ({
  isSignLoader,
  authError,
  setApiResponseError,
  sendActivationMail,
  registerWithGoogle,
}) => {
  const classes = useStyles();

  const handleFormSubmit = (values: FormData) => {
    if (authError.data?.errorStatus !== -1) {
      setApiResponseError('', DEFAULT_RESPONSE_ERROR);
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
    authError.data?.errorStatus === 400 &&
    (authError.data?.data.email || authError.data?.data.username);

  return (
    <div className={classes.root}>
      <Info />

      <div className={classes.formContainer}>
        <p className={classes.signinTitle}>Register your account</p>
        {/* <GoogleLogin
            className={classes.googleLogin}
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
            <form onSubmit={handleSubmit} className={classes.form}>
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

              <div className={classes.signButtonBlock}>
                {!!submitError && (
                  <p className={classes.error}>{submitError}</p>
                )}

                {authError.data?.errorStatus !== -1 && !isAccountExist && (
                  <p className={classes.error}>{authError.data?.errorText}</p>
                )}

                {isAccountExist && (
                  <p className={classes.error}>
                    Looks like you already have an account.
                    <NavLink
                      className={classes.link}
                      to={user.signin}
                      // activeClassName="active"
                    >
                      Log in.
                    </NavLink>
                  </p>
                )}

                <Button
                  className={classes.signSubmitBtn}
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

        <p className={classes.logInText}>
          Already have an account?
          <NavLink
            className={classes.link}
            to={user.signin}
            activeClassName="active"
          >
            Log in.
          </NavLink>
        </p>
      </div>

      <Spinner active={isSignLoader} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(UnconnectedSignUp);
