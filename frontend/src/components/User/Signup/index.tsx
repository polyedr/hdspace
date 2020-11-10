import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, Form } from 'react-final-form';
import { Link } from 'react-router-dom';
// import { GoogleLogin } from 'react-google-login';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { user } from '../../../constants/pathNames';
import { Info } from '../Info';
import {
  selectAuthError,
  selectIsUserLoading,
} from '../../../redux/user/selectors';
import {
  // registerWithGoogle,
  sendActivationMail,
} from '../../../redux/user/actions';
import { SignupFormData } from '../../../types';

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
      padding: '4em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    form: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center',
    },
    header: {
      fontSize: '1.6em',
      margin: '1em',
    },
    googleLogin: {
      width: '100%',
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    error: {
      marginTop: '1em',
      minHeight: '5em',
    },
    field: {
      margin: '1em',
    },
    login: {
      fontSize: '1.1em',
    },
    link: {
      '&, &:active, &:visited, &:focus': {
        color: theme.palette.primary.main,
      },
    },
  }),
);

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const authError = useSelector(selectAuthError);
  const isLoading = useSelector(selectIsUserLoading);

  const handleFormSubmit = (values: SignupFormData) => {
    dispatch(
      sendActivationMail(
        values.username,
        values.email,
        values.password,
        values.firstName,
        values.lastName,
      ),
    );
  };

  // TODO add google button and this method, when the backend will register new users using google token
  /* const responseGoogle = (response: any) => {
  dispatch(registerWithGoogle());
    // eslint-disable-next-line no-console
    console.log(response);
  }; */

  return (
    <div className={classes.root}>
      <Info />

      <div className={classes.formContainer}>
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
          render={({ handleSubmit }) => (
            <Container maxWidth="xs">
              <form onSubmit={handleSubmit} className={classes.form}>
                <Typography className={classes.header}>
                  Register your account
                </Typography>

                <Field name="username">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.field}
                      type="text"
                      label="Username"
                      placeholder="Username"
                      required
                      variant="filled"
                      autoFocus
                      size="small"
                      fullWidth
                      error={(meta.error || meta.submitError) && meta.touched}
                      helperText={
                        (meta.error || meta.submitError) && meta.touched
                          ? meta.error || meta.submitError
                          : null
                      }
                    />
                  )}
                </Field>

                <Field name="firstName">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.field}
                      type="text"
                      label="First Name"
                      placeholder="First Name"
                      required
                      variant="filled"
                      autoFocus
                      size="small"
                      fullWidth
                      error={(meta.error || meta.submitError) && meta.touched}
                      helperText={
                        (meta.error || meta.submitError) && meta.touched
                          ? meta.error || meta.submitError
                          : null
                      }
                    />
                  )}
                </Field>

                <Field name="lastName">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.field}
                      type="text"
                      label="Last Name"
                      placeholder="Last Name"
                      required
                      variant="filled"
                      autoFocus
                      size="small"
                      fullWidth
                      error={(meta.error || meta.submitError) && meta.touched}
                      helperText={
                        (meta.error || meta.submitError) && meta.touched
                          ? meta.error || meta.submitError
                          : null
                      }
                    />
                  )}
                </Field>

                <Field name="email">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.field}
                      type="email"
                      label="Email"
                      placeholder="Email"
                      required
                      variant="filled"
                      autoFocus
                      size="small"
                      fullWidth
                      error={(meta.error || meta.submitError) && meta.touched}
                      helperText={
                        (meta.error || meta.submitError) && meta.touched
                          ? meta.error || meta.submitError
                          : null
                      }
                    />
                  )}
                </Field>

                <Field name="password">
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.field}
                      type="password"
                      label="Password"
                      placeholder="Password"
                      required
                      variant="filled"
                      autoFocus
                      size="small"
                      fullWidth
                      error={(meta.error || meta.submitError) && meta.touched}
                      helperText={
                        (meta.error || meta.submitError) && meta.touched
                          ? meta.error || meta.submitError
                          : null
                      }
                    />
                  )}
                </Field>

                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Sign Up
                </Button>

                <div className={classes.error}>
                  {authError && (
                    <Alert severity="error" variant="filled">
                      {authError.message}
                    </Alert>
                  )}
                </div>

                <p className={classes.login}>
                  {'Already have an account? '}

                  <Link className={classes.link} to={user.signin}>
                    Log in.
                  </Link>
                </p>
              </form>
            </Container>
          )}
        />
      </div>
    </div>
  );
};

export default Signup;
