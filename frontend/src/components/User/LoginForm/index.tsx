// @ts-nocheck
import React, { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import MakeAsyncFunction from 'react-redux-promise-listener';
import PATH_NAMES from '@Constants/pathNames';
import { promiseListener } from '@Redux/store';
import TYPES from '@Redux/actionTypes';
import {
  Typography,
  TextField,
  Button,
  Container,
  InputAdornment,
} from '@material-ui/core';
import {
  composeValidators,
  isLongLength,
  isPassword,
} from '@Utils/validators';
import SubmitError from '../SubmitError';
import useStyles from '../LoginRegistration/LoginRegistrationStyles';
import user from '../../../assets/images/user.png';
import padlock from '../../../assets/images/padlock.png';
import logo from '../../../assets/images/logo.png';

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const [formErrors, setFormErrors] = useState<string[] | null>([]);

  // TODO add google button and this method, when the backend will register new users using google token
  /* const responseGoogle = (response: any) => {

    console.log(response);
  }; */

  return (
    <MakeAsyncFunction
      listener={promiseListener}
      start={TYPES.LOGIN_CHAT_USER}
      resolve={TYPES.LOGIN_COMPLETE}
      reject={TYPES.LOGIN_FAILURE}
    >
      {(onSubmit) => (
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, submitError, errors }) => (
            <Container maxWidth="xs">
              <form
                onSubmit={(e) => {
                  setFormErrors(Object.values(errors));
                  handleSubmit();
                  e.preventDefault();
                }}
                className={classes.containerCenter}
              >
                <img src={logo} alt="Logo" />
                <Typography className={classes.underLogoText}>
                  Login to Your ADEVI Account
                </Typography>
                {/* <GoogleLogin
              className={styles.googleLogin}
              clientId="97708805893-kqh3efrnsd7i8nbu30p0mhlvhub029he.apps.googleusercontent.com"
              buttonText="Sign in with google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            /> */}

                <Field name="username">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.input}
                      type="text"
                      placeholder="User Name"
                      required
                      autoFocus
                      error={(meta.error || meta.submitError) && meta.touched}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={user} alt="user" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>

                <Field
                  name="password"
                  validate={composeValidators(isPassword, isLongLength)}
                >
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.input}
                      type="password"
                      placeholder="Password"
                      required
                      error={(meta.error || meta.submitError) && meta.touched}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={padlock} alt="padlock" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </Field>

                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  disabled={submitting}
                  className={classes.button}
                >
                  Login
                </Button>
                <div className={classes.error}>
                  <SubmitError name="detail" />

                  {submitError && (
                    <Alert severity="error" variant="filled">
                      {submitError}
                    </Alert>
                  )}
                  {formErrors?.length !== 0 && (
                    <Alert severity="error" variant="filled">
                      {formErrors?.map((err) => (
                        <span>{err}</span>
                      ))}
                    </Alert>
                  )}
                </div>

                <Typography className={classes.underFormText} variant="body2">
                  Forgot your login or password?
                  <Link to={PATH_NAMES.user.password} className={classes.link}>
                    Click here
                  </Link>
                </Typography>

                <Typography className={classes.underFormText} variant="body1">
                  New User? Create an Account for free.
                  <Link to={PATH_NAMES.user.signup} className={classes.link}>
                    Click here
                  </Link>
                </Typography>
              </form>
            </Container>
          )}
        />
      )}
    </MakeAsyncFunction>
  );
};

export default LoginForm;
