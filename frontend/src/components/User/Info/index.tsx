import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '60%',
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
    },
    title: {
      fontSize: 72,
      lineHeight: '100px',
      fontWeight: 400,
      textTransform: 'uppercase',
    },
    description: {
      marginBottom: 10,
      fontSize: 24,
      lineHeight: '36px',
    },
    listItem: {
      paddingLeft: 10,
      marginBottom: 10,
    },
  }),
);

export const Info: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>adevi</h2>

      <p className={classes.description}>
        AI Assistant for App Development that is excellent for:
      </p>

      <ul>
        <li className={classes.listItem}>
          * Non-technical people to build full length web or mobile application
        </li>

        <li className={classes.listItem}>
          * Developers to quickly generate the most complete front-end code
        </li>
      </ul>
    </div>
  );
};

export default Info;
