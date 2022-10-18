/* eslint-disable import/no-unresolved */
import React from 'react';
import { connect } from 'react-redux';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
import * as Actions from '@Redux/user/actions';
import {
  composeValidators,
  isLongLength,
  isRequired,
  isPassword,
} from '@Utils/validators';
import { AppReduxState } from '@Redux/types';

import {
  InputAdornment,
  TextField,
  Typography,
  Container,
  Button,
} from '@material-ui/core';

import PATH_NAMES from '@Constants/pathNames';
import Info from '../Info';
import Spinner from '../../UI/Spinner';

import useStyles from '../LoginRegistration/LoginRegistrationStyles';
import padlock from '../../../assets/images/padlock.png';
import logo from '../../../assets/images/logo.png';
import bigimg from '../../../assets/images/bigimg2.png';

type FormData = {
  newPassword: string;
  reNewPassword: string;
};

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
    <div className={classes.root}>
      <Info
        title="AI Assistant for App Development with extended collaboration tools"
        list={[
          'The ADEVI platform includes a project management module that allows you to track all the stages of creating your application, regardless of the type of work performed.',
          'Everything is under your control 24 hours a day 7 days a week.',
        ]}
        img={bigimg}
      />

      <div className={classes.formContainer}>
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
              <form onSubmit={handleSubmit} className={classes.containerCenter}>
                <img src={logo} alt="Logo" />
                <Typography className={classes.underLogoText}>
                  Reset Your Password
                </Typography>
                <Field
                  name="newPassword"
                  validate={composeValidators(
                    isRequired,
                    isLongLength,
                    isPassword,
                  )}
                >
                  {({ input, meta }) => (
                    <>
                      <TextField
                        {...input}
                        className={classes.input}
                        placeholder="New password"
                        type="password"
                        required
                        autoFocus
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
                    </>
                  )}
                </Field>
                <Field name="reNewPassword">
                  {({ input, meta }) => (
                    <>
                      <TextField
                        {...input}
                        className={classes.input}
                        placeholder="Retype new password"
                        type="password"
                        required
                        autoFocus
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
                    </>
                  )}
                </Field>
                <div className="signButtonBlock">
                  {!!submitError && <p>{submitError}</p>}
                  {authError && <p>{authError.message}</p>}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                  >
                    Change password
                  </Button>
                </div>
                <Link to={PATH_NAMES.user.signin} className={classes.link}>
                  Back to Login
                </Link>
              </form>
            </Container>
          )}
        </Form>
      </div>
      <Spinner active={isSignLoader} />
    </div>
  );
};

export default connect(mapState, mapDispatch)(ResetPassword);
