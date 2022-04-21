/* eslint-disable import/no-unresolved */
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, Form } from 'react-final-form';
import { sendResetPasswordMail } from '@Redux/user/actions';

import {
  InputAdornment,
  TextField,
  Typography,
  Container,
  Button,
  Grid,
} from '@material-ui/core';

import PATH_NAMES from '@Constants/pathNames';
import { Alert } from '@material-ui/lab';
import { isValidEmail } from '@Utils/validators';
import Info from '../Info';

import useStyles from '../LoginRegistration/LoginRegistrationStyles';
import mail from '../../../assets/images/mail.png';
import logo from '../../../assets/images/logo.png';
import bigimg from '../../../assets/images/bigimg2.png';
import SubmitError from '../SubmitError';

const ResetPassword: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const confirmRestore = (values: { email: string }) => {
    dispatch(sendResetPasswordMail(values.email));
  };

  return (
    <div className={classes.root}>
      <Info
        title={['Did you know?', 'When working with ADEVI, you always can:']}
        list={[
          'Visualize and digitalize coded interfaces',
          'Add charts and widgets',
        ]}
        img={bigimg}
      />

      <Grid item xs={12} sm={5} className={classes.containerCenter}>
        <Form
          onSubmit={confirmRestore}
          subscription={{ submitError: true, submitting: true }}
        >
          {({ handleSubmit, submitError, submitting }) => (
            <Container maxWidth="xs">
              <form onSubmit={handleSubmit} className={classes.containerCenter}>
                <img src={logo} alt="Logo" />
                <Typography className={classes.underLogoText}>
                  Reset Your Password
                </Typography>
                <Field name="email" validate={isValidEmail}>
                  {({ input, meta }) => (
                    <TextField
                      {...input}
                      className={classes.input}
                      placeholder="Email"
                      type="email"
                      required
                      autoFocus
                      error={(meta.error || meta.submitError) && meta.touched}
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
                <Button
                  type="submit"
                  disabled={submitting}
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                >
                  Change password
                </Button>
                <div className="signButtonBlock">
                  {submitError && (
                    <div className={classes.error}>
                      <SubmitError name="detail" />
                      <Alert severity="error" variant="filled">
                        {submitError}
                      </Alert>
                    </div>
                  )}
                </div>
                <Link to={PATH_NAMES.user.signin} className={classes.link}>
                  Back to Login
                </Link>
              </form>
            </Container>
          )}
        </Form>
      </Grid>
    </div>
  );
};

export default ResetPassword;
