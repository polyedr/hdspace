/* eslint-disable import/no-unresolved */
// @ts-nocheck
import React, { useState } from 'react';
import MakeAsyncFunction from 'react-redux-promise-listener';
import { Field, Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import PATH_NAMES from '@Constants/pathNames';
import { promiseListener } from '@Redux/store';
import TYPES from '@Redux/actionTypes';
import {
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  InputAdornment,
} from '@material-ui/core';
import { composeValidators, isPassword, isLongLength } from '@Utils/validators';
import useStyles from '../LoginRegistration/LoginRegistrationStyles';
import logo from '../../../assets/images/logo.png';
import card from '../../../assets/images/id-card.png';
import mail from '../../../assets/images/mail.png';
import user from '../../../assets/images/user.png';
import padlock from '../../../assets/images/padlock.png';
import Info from '../Info';
import bigimg from '../../../assets/images/bigimg.png';

const Signup: React.FC = () => {
  const classes = useStyles();
  const [formErrors, setFormErrors] = useState<string[] | null>([]);

  // TODO add google button and this method, when the backend will register new users using google token
  /* const responseGoogle = (response: any) => {
  dispatch(registerWithGoogle());

    console.log(response);
  }; */

  return (
    <div className={classes.root}>
      <Info
        title="AI Assistant for App Development that is excellent for"
        list={[
          'Non-technical people to build a full-length web or mobile application',
          'Developers to quickly generate the most complete front-end code',
          'Collaborate on your app project with the whole team in a better way',
        ]}
        img={bigimg}
      />
      <Grid item xs={12} sm={5} className={classes.containerCenter}>
        <img className={classes.resizableImg} src={logo} alt="Logo" />
        {/* <GoogleLogin
            className={classes.googleLogin}
            clientId="97708805893-kqh3efrnsd7i8nbu30p0mhlvhub029he.apps.googleusercontent.com"
            buttonText="Sign up with google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
            redirectUri="https://staging-26-10.firebaseapp.com/projects"
          /> */}
        <MakeAsyncFunction
          listener={promiseListener}
          start={TYPES.REGISTER}
          resolve={TYPES.REGISTER_COMPLETE}
          reject={TYPES.REGISTER_FAILURE}
        >
          {(onSubmit) => (
            <Form
              onSubmit={onSubmit}
              render={({
                handleSubmit,
                submitError,
                submitErrors,
                submitting,
                errors,
              }) => (
                <Container maxWidth="xs">
                  <form
                    onSubmit={(e) => {
                      setFormErrors(Object.values(errors));
                      handleSubmit();
                      e.preventDefault();
                    }}
                    className={classes.containerCenter}
                  >
                    <Typography className={classes.underLogoText}>
                      Register Your Account
                    </Typography>

                    <Field name="firstName">
                      {({ input }) => (
                        <TextField
                          {...input}
                          className={classes.input}
                          type="text"
                          placeholder="First Name"
                          required
                          autoFocus
                          InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <img src={card} alt="card" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Field>
                    <Field name="lastName">
                      {({ input }) => (
                        <TextField
                          {...input}
                          className={classes.input}
                          type="text"
                          placeholder="Last Name"
                          required
                          autoFocus
                          InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <img src={card} alt="card" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Field>
                    <Field name="username">
                      {({ input }) => (
                        <TextField
                          {...input}
                          className={classes.input}
                          type="text"
                          placeholder="User Name"
                          autoFocus
                          required
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

                    <Field name="email">
                      {({ input }) => (
                        <TextField
                          {...input}
                          className={classes.input}
                          type="email"
                          placeholder="Email"
                          required
                          autoFocus
                          InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <img src={mail} alt="mail" />
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
                      {({ input }) => (
                        <TextField
                          {...input}
                          className={classes.input}
                          type="password"
                          placeholder="Password"
                          required
                          autoFocus
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
                      disabled={submitting}
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                    >
                      Sign Up
                    </Button>
                    <div className={classes.error}>
                      {(submitError || submitErrors) && (
                        <Alert severity="error" variant="filled">
                          {submitError ||
                            Object.keys(submitErrors).map((obj) => (
                              <p className={classes.alertText}>
                                {submitErrors[obj]}
                              </p>
                            ))}
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

                    <Typography
                      className={classes.underFormText}
                      variant="body2"
                    >
                      Already have an account?
                      <Link
                        className={classes.link}
                        to={PATH_NAMES.user.signin}
                      >
                        Click here
                      </Link>
                    </Typography>
                    <Typography
                      className={classes.underFormText}
                      variant="body1"
                    >
                      Forgot your Login or Password?
                      <Link
                        to={PATH_NAMES.user.password}
                        className={classes.link}
                      >
                        Click here
                      </Link>
                    </Typography>
                  </form>
                </Container>
              )}
            />
          )}
        </MakeAsyncFunction>
      </Grid>
    </div>
  );
};

export default Signup;
