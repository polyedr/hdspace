import React from 'react';
import { useSelector } from 'react-redux';
import Alert from '@mui/lab/Alert';
import { Grid } from '@mui/material';
import { selectConfirmMessage } from '@Redux/user/selectors';
import LoginForm from '../LoginForm';
import Info from '../Info';
import useStyles from '../LoginRegistration/LoginRegistrationStyles';

import bigimg from '../../../assets/images/bigimg3.png';

const SignIn: React.FC = () => {
  const classes = useStyles();
  const confirmMessage = useSelector(selectConfirmMessage);

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <Info
            title="Did you know?"
            list={[
              'Our AI system recognizes Graphical User Interfaces (GUIs) including separate elements with color and layout patterns.',
              'You can add ready-made templates or draw your own drawing: our AI system will recognize and include it  in your project.',
            ]}
            img={bigimg}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <div className={classes.formContainer}>
            {confirmMessage && (
              <div className={classes.info}>
                <Alert severity="info" variant="filled">
                  {confirmMessage}
                </Alert>
              </div>
            )}
            <LoginForm />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignIn;
