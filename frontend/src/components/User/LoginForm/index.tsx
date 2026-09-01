// @ts-nocheck
import React from 'react';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import MakeAsyncFunction from 'react-redux-promise-listener';
import {
  Typography,
  Button,
  Container,
  InputAdornment,
  Box,
} from '@mui/material';
import PATH_NAMES from '@Constants/pathNames';
import { promiseListener } from '@Redux/store';
import TYPES from '@Redux/actionTypes';
import {
  composeValidators,
  isLongLength,
  isPassword,
  isRequired,
  isUsername,
} from '@Utils/validators';
import { TextField } from '../FormField';
import useStyles from '../LoginRegistration/LoginRegistrationStyles';
import user from '../../../assets/images/user.png';
import padlock from '../../../assets/images/padlock.png';
import logo from '../../../assets/images/logo.png';
import SubmitError from '../SubmitError';

const LoginForm: React.FC = () => {
  const classes = useStyles();

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
          render={({ handleSubmit, submitting }) => (
            <Container maxWidth="xs">
              <form
                onSubmit={(e) => {
                  handleSubmit();
                  e.preventDefault();
                }}
                className={classes.containerCenter}
              >
                <Box className={classes.resizableImg}>
                  <img src={logo} alt="Logo" />
                </Box>
                <Typography sx={{ mb: 1 }} className={classes.underLogoText}>
                  Login to Your ADEVI Account
                </Typography>

                <TextField
                  validate={composeValidators(isRequired, isUsername)}
                  type="text"
                  label="Username"
                  name="username"
                  autoFocus
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src={user} alt="user" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  type="password"
                  label="Password"
                  name="password"
                  validate={composeValidators(isPassword, isLongLength)}
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src={padlock} alt="padlock" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mb: 3, mt: 3 }}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    disabled={submitting}
                    className={classes.button}
                    fullWidth
                  >
                    Login
                  </Button>
                </Box>

                <SubmitError style={{ marginBottom: 15 }} name="detail" />

                <Typography fontSize={16} textAlign="center" variant="body2">
                  Forgot your login or password?
                  <Link to={PATH_NAMES.user.password} className={classes.link}>
                    Click here
                  </Link>
                </Typography>

                <Typography fontSize={16} textAlign="center" variant="body1">
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
