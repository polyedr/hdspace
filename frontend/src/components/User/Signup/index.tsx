/* eslint-disable import/no-unresolved */
// @ts-nocheck
import React from 'react';
import MakeAsyncFunction from 'react-redux-promise-listener';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Container,
  Grid,
  Stack,
  Box,
  InputAdornment,
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
  isValidEmail,
} from '@Utils/validators';
import { TextField } from '../FormField';

import logo from '../../../assets/images/logo.png';
import card from '../../../assets/images/id-card.png';
import mail from '../../../assets/images/mail.png';
import user from '../../../assets/images/user.png';
import padlock from '../../../assets/images/padlock.png';
import Info from '../Info';
import bigimg from '../../../assets/images/bigimg.png';
import useStyles from '../LoginRegistration/LoginRegistrationStyles';
import SubmitError from '../SubmitError';

const Signup: React.FC = () => {
  const classes = useStyles();

  // TODO add google button and this method, when the backend will register new users using google token
  /* const responseGoogle = (response: any) => {
  dispatch(registerWithGoogle());

    console.log(response);
  }; */

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12} sm={7}>
        <Info
          title="AI Assistant for App Development that is excellent for"
          list={[
            'Non-technical people to build a full-length web or mobile application',
            'Developers to quickly generate the most complete front-end code',
            'Collaborate on your app project with the whole team in a better way',
          ]}
          img={bigimg}
        />
      </Grid>
      <Grid
        className={classes.rightContainer}
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        item
        sm={5}
        xs={12}
      >
        <Stack>
          <Box className={classes.resizableImg}>
            <img src={logo} alt="Logo" />
          </Box>
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
                render={({ handleSubmit, submitting }) => (
                  <Container maxWidth="xs">
                    <form
                      onSubmit={(e) => {
                        handleSubmit();
                        e.preventDefault();
                      }}
                      className={classes.containerCenter}
                    >
                      <Typography
                        textAlign="center"
                        fontSize={20}
                        sx={{ mb: 1 }}
                      >
                        Register Your Account
                      </Typography>

                      <TextField
                        validate={isRequired}
                        label="First Name"
                        name="firstName"
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <img src={card} alt="card" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        validate={isRequired}
                        label="Last Name"
                        name="lastName"
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <img src={card} alt="card" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        validate={composeValidators(isRequired, isUsername)}
                        label="Username"
                        name="username"
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <img src={user} alt="card" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        validate={composeValidators(isRequired, isValidEmail)}
                        label="Email"
                        name="email"
                        type="email"
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <img src={mail} alt="card" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        validate={composeValidators(
                          isRequired,
                          isLongLength,
                          isPassword,
                        )}
                        label="Password"
                        name="password"
                        type="password"
                        InputProps={{
                          disableUnderline: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <img src={padlock} alt="card" />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Box sx={{ mb: 3, mt: 3 }}>
                        <Button
                          type="submit"
                          disabled={submitting}
                          variant="contained"
                          fullWidth
                          color="secondary"
                          className={classes.button}
                        >
                          Sign Up
                        </Button>
                      </Box>

                      <SubmitError
                        style={{ marginBottom: 15 }}
                        name="username"
                      />

                      <Typography
                        fontSize={16}
                        textAlign="center"
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
                        fontSize={16}
                        textAlign="center"
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
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Signup;
