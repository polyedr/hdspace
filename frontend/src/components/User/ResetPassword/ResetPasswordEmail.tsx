/* eslint-disable import/no-unresolved */
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form } from 'react-final-form';
import { sendResetPasswordMail } from '@Redux/user/actions';

import {
  InputAdornment,
  Typography,
  Container,
  Button,
  Grid,
  Box,
} from '@mui/material';

import PATH_NAMES from '@Constants/pathNames';
import { Alert } from '@material-ui/lab';
import { composeValidators, isRequired, isValidEmail } from '@Utils/validators';
import { TextField } from '../FormField';
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
    <Grid container className={classes.root}>
      <Info
        title={['Did you know?', 'When working with ADEVI, you always can:']}
        list={[
          'Visualize and digitalize coded interfaces',
          'Add charts and widgets',
        ]}
        img={bigimg}
      />

      <Grid
        container
        xs={12}
        sm={5}
        alignItems="center"
        justifyContent="center"
      >
        <Form
          onSubmit={confirmRestore}
          subscription={{ submitError: true, submitting: true }}
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
                  name="email"
                  validate={composeValidators(isRequired, isValidEmail)}
                  type="email"
                  label="Email"
                  autoFocus
                  InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <img src={mail} alt="padlock" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ mb: 3, mt: 3 }}>
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
                <Typography textAlign="center">
                  <Link to={PATH_NAMES.user.signin} className={classes.link}>
                    Back to Login
                  </Link>
                </Typography>
              </form>
            </Container>
          )}
        </Form>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
