import React from 'react';
import { Typography, Grid } from '@mui/material';
import bigimg from '../../../assets/images/bigimg.png';
import logo from '../../../assets/images/logo.png';
import Info from '../Info';
import useStyles from '../LoginRegistration/LoginRegistrationStyles';

const Success: React.FC = () => {
  const classes = useStyles();

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
      <Grid
        item
        xs={12}
        sm={5}
        container
        alignItems="center"
        justifyContent="center"
      >
        <img src={logo} alt="Logo" />
        <div className={classes.main}>
          <Typography className={classes.underLogoText}>
            Thanks for Registration
          </Typography>
          <Typography className={classes.text}>
            Thank you for registering your ADEVI account. To confirm your
            registration follow the link that was sent to your email address.
          </Typography>
        </div>
      </Grid>
    </div>
  );
};

export default Success;
