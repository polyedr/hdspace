import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

export function SubscriptionCard({ result }) {
  const currentDate = new Date();

  const handleGoToPricing = useCallback(() => {
    window.location.href = 'https://adevi.io/pricing/';
  }, []);

  return (
    <div>
      <Box sx={{ width: '100%' }} style={{ display: 'flex' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2 }}>
          {result?.map((resultData) => {
            const periodDate = resultData.period_end
              .toLocaleString()
              .split(',')[0];
            const periodEndDate = new Date(periodDate);
            const milliSFirst = currentDate.getTime();
            const milliSSecond = periodEndDate.getTime();
            const difference =
              (milliSSecond - milliSFirst) / (1000 * 3600 * 24);
            const trialEndDate = resultData.trial_end
              ? format(Date.parse(resultData.trial_end), 'MMM  dd, yyyy')
              : null;
            const periodEndDateFormat = resultData.period_end
              ? format(Date.parse(resultData.period_end), 'MMM  dd, yyyy')
              : null;
            return (
              <Grid
                item
                xs={6}
                sx={{ height: '182px', marginTop: '14px  ' }}
                style={{ width: '100%' }}
                key={resultData.product_id}
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
                        onClick={handleGoToPricing}
                        style={{ background: '#5064FF', color: '#FFFFFF' }}
                        variant="contained"
                      >
                        Upgrade
                      </Button>
                    ) : (
                      <Button
                        onClick={handleGoToPricing}
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
}
