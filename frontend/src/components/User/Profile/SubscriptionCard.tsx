import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button } from '@material-ui/core';
import moment from 'moment';

export const SubscriptionCard = ({ result }) => {
  const currentDate = new Date();

  return (
    <div>
      <Box sx={{ width: '100%' }} style={{ display: 'flex' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
          {result?.map((resultData, i) => {
            const periodDate = resultData.period_end
              .toLocaleString()
              .split(',')[0];
            const periodEndDate = new Date(periodDate);
            const milliSFirst = currentDate.getTime();
            const milliSSecond = periodEndDate.getTime();
            const difference =
              (milliSSecond - milliSFirst) / (1000 * 3600 * 24);
            const trialEndDate = moment(resultData.trial_end).format(
              'MMM  DD, YYYY',
            );
            const periodEndDateFormat = moment(resultData.period_end).format(
              'MMM DD, YYYY',
            );
            return (
              <Grid
                item
                xs={6}
                sx={{ height: '182px', marginTop: '14px  ' }}
                style={{ width: '100%' }}
                key={i}
              >
                <Card
                  sx={{ minWidth: 275, minHeight: 182 }}
                  style={{ fontFamily: 'Roboto' }}
                >
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 12 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      PLAN DETAILS
                    </Typography>
                    <Typography variant="h6" component="div" color="#5064FF">
                      {resultData.product_name}
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: 14 }}>
                      {resultData.subscription_status === 'trialing' ? (
                        <span>
                          {' '}
                          Your 14-day free period is about to expire{' '}
                          {trialEndDate}
                          <br />
                        </span>
                      ) : null}
                      {difference > 0 ? (
                        <span> Next billing date is {periodEndDateFormat}</span>
                      ) : (
                        <span>Subscription until {periodEndDateFormat}</span>
                      )}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {difference > 0 ? (
                      <Button
                        style={{ background: '#5064FF', color: '#FFFFFF' }}
                        variant="contained"
                      >
                        Upgrade
                      </Button>
                    ) : (
                      <Button
                        style={{
                          background: '#5064FF',
                          color: '#FFFFFF',
                          marginTop: '25px',
                        }}
                        variant="contained"
                      >
                        Resume Memership
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </div>
  );
};
