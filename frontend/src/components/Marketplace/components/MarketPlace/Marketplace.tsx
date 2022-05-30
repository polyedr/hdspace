/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Box } from '@material-ui/core';
import Searchbar from './Searchbar';
import TemplateCard from './TemplateCard';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
      padding: theme.spacing(1),
    },
    header: {
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    headerAction: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '0px',
      gap: '16px',
      width: '660px',
      height: '36px',
      left: '203px',
      top: '186px',
    },
    headerText: {
      display: 'flex',
      alignItems: 'center',
      width: '112px',
      height: '30px',
      left: '203px',
      top: '80px',
      fontWeight: 500,
      fontFamily: theme.typography.fontFamily,
      fontStyle: 'normal',
      lineHeight: '150%',
      color: '#2A2A2D',
    },
    contentText: {
      display: 'flex',
      width: '472px',
      height: '40px',
      left: '203px',
      top: '122px',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      fontWeight: 400,
      lineHeight: '145%',
      color: '#2A2A2D',
    },
    projectCards: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '16px',
      width: '960px',
      height: '484px',
      left: '203px',
      top: '238px',
      padding: theme.spacing(1),
    },
  }),
);

const Marketplace: React.FC = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <div className={classes.header}>
          <Typography variant="h5" className={classes.headerText}>
            Marketplace
          </Typography>

          <Typography variant="h6" className={classes.contentText}>
            Dont know where to start with your project? Feel free to use our
            templates to inspire your creativity
          </Typography>
          <div className={classes.headerAction}>
            <Searchbar />
          </div>
        </div>

        <Box sx={{ flexGrow: 1 }} className={classes.projectCards}>
          <TemplateCard />
        </Box>
      </div>
    </Container>
  );
};

export default memo(Marketplace);
