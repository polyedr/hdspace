import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Field, Form } from 'react-final-form';
import { Link } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import MuiLink from '@material-ui/core/Link';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import MakeAsyncFunction from 'react-redux-promise-listener';
import { PATH_NAMES } from '@Constants/pathNames';
import { sendResetPasswordMail } from '@Redux/user/actions';
import { promiseListener } from '@Redux/store';
import TYPES from '@Redux/actionTypes';
import Dialog from '../../Dialogs/Dialog';
import SubmitError from '../SubmitError';

const useStyles = makeStyles((theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center',
    },
    header: {
      fontSize: '1.6em',
      margin: '1em',
    },
    field: {
      margin: '1em',
    },
    error: {
      marginTop: '1em',
      minHeight: '5em',
    },
    signup: {
      fontSize: '1.1em',
    },
    link: {
      '&, &:active, &:visited, &:focus': {
        color: theme.palette.primary.main,
      },
    },
  }),
);

const LoginForm: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);

  const closeModal = () => {
    setOpen(false);
  };

  const handleRestoreClick = () => {
    setOpen(true);
  };

  const confirmRestore = (values: { email: string }) => {
    dispatch(sendResetPasswordMail(values.email));
    closeModal();
  };

  // TODO add google button and this method, when the backend will register new users using google token
  /* const responseGoogle = (response: any) => {
    // eslint-disable-next-line no-console
    console.log(response);
  }; */

  return (
    <MakeAsyncFunction
      listener={promiseListener}
      start={TYPES.LOGIN}
      resolve={TYPES.LOGIN_COMPLETE}
      reject={TYPES.LOGIN_FAILURE}
    >
      {(onSubmit) => (
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, submitError }) => (
            <Container maxWidth="xs">
              <form onSubmit={handleSubmit} className={classes.form}>
                <Typography className={classes.header}>
                  Login to your account
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
                  fullWidth
                  color="primary"
                  variant="contained"
                  disabled={submitting}
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
                </div>

                <MuiLink
                  component="button"
                  type="button"
                  onClick={handleRestoreClick}
                >
                  Forgot password?
                </MuiLink>

                <p className={classes.signup}>
                  {'Create an account '}
                  <Link to={PATH_NAMES.user.signup} className={classes.link}>
                    for free
                  </Link>
                </p>

                <Dialog
                  open={open}
                  title="Restore password"
                  onSubmit={confirmRestore}
                  onClose={closeModal}
                  description="Please, enter your email address."
                  fieldName="email"
                  type="email"
                />
              </form>
            </Container>
          )}
        />
      )}
    </MakeAsyncFunction>
  );
};

export default LoginForm;
