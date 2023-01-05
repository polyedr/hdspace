/* eslint-disable import/no-unresolved */
import React from 'react';
import { connect } from 'react-redux';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { Form } from 'react-final-form';
import * as Actions from '@Redux/user/actions';
import {
  composeValidators,
  isLongLength,
  isRequired,
  isPassword,
} from '@Utils/validators';
import { AppReduxState } from '@Redux/types';

import PATH_NAMES from '@Constants/pathNames';
import {
  Grid,
  InputAdornment,
  Typography,
  Container,
  Button,
  Box,
} from '@mui/material';
import { TextField } from '../FormField';

import Info from '../Info';
import Spinner from '../../UI/Spinner';

import useStyles from '../LoginRegistration/LoginRegistrationStyles';
import padlock from '../../../assets/images/padlock.png';
import logo from '../../../assets/images/logo.png';
import bigimg from '../../../assets/images/bigimg2.png';

interface FormData {
  newPassword: string;
  reNewPassword: string;
}

const mapState = ({ user: { isLoading, error } }: AppReduxState) => ({
  isLoading,
  error,
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

  const { uid, token } = match?.params as unknown as {
    uid: string;
    token: string;
  };

  const initialValues: FormData = {
    newPassword: '',
    reNewPassword: '',
  };

  const history = useHistory();

  const handleFormSubmit = (values: FormData) => {
    resetPasswordConfirmation(
      uid,
      token,
      values.newPassword,
      values.reNewPassword,
    );
    history.push(PATH_NAMES.user.signin);
  };

  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Info
        title="AI Assistant for App Development with extended collaboration tools"
        list={[
          'The ADEVI platform includes a project management module that allows you to track all the stages of creating your application, regardless of the type of work performed.',
          'Everything is under your control 24 hours a day 7 days a week.',
        ]}
        img={bigimg}
      />

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        item
        sm={5}
        xs={12}
        className={classes.rightContainer}
      >
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
            <Container maxWidth="xs">
              <form onSubmit={handleSubmit}>
                <Box className={classes.resizableImg}>
                  <img src={logo} alt="Logo" />
                </Box>
                <Typography className={classes.underLogoText}>
                  Reset Your Password
                </Typography>

                <TextField
                  name="newPassword"
                  validate={composeValidators(
                    isRequired,
                    isLongLength,
                    isPassword,
                  )}
                  type="password"
                  label="New password"
                  autoFocus
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src={padlock} alt="padlock" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  name="reNewPassword"
                  validate={composeValidators(
                    isRequired,
                    isLongLength,
                    isPassword,
                  )}
                  type="password"
                  label="Retype new password"
                  autoFocus
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
                  {!!submitError && <p>{submitError}</p>}
                  {authError && <p>{authError.message}</p>}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    fullWidth
                  >
                    Change password
                  </Button>
                </Box>
                <Typography fontSize={16} variant="body1" textAlign="center">
                  <Link to={PATH_NAMES.user.signin} className={classes.link}>
                    Back to Login
                  </Link>
                </Typography>
              </form>
            </Container>
          )}
        </Form>
      </Grid>
      <Spinner active={isSignLoader} />
    </Grid>
  );
};

export default connect(mapState, mapDispatch)(ResetPassword);
