import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    width: '60%',
    color: '#fff',
    backgroundColor: '#2f4050',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2em',
  },
  wrapper: {
    textAlign: 'right',
  },
  title: {
    margin: 0,
    fontSize: 72,
    lineHeight: '100px',
    fontWeight: 400,
    textTransform: 'uppercase',
    color: '#000',
  },
  description: {
    marginBottom: 10,
    fontSize: 24,
    lineHeight: '36px',
  },
  list: {
    listStyleType: 'none',
  },
  listItem: {
    paddingLeft: 10,
    marginBottom: 10,
  },
});

export const Info: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>adevi</h2>

        <p className={classes.description}>
          AI Assistant for App Development that is excellent for:
        </p>

        <ul className={classes.list}>
          <li className={classes.listItem}>
            * Non-technical people to build full length web or mobile
            application
          </li>

          <li className={classes.listItem}>
            * Developers to quickly generate the most complete front-end code
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Info;
