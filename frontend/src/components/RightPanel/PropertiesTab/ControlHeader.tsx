import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  header: {
    margin: 0,
    padding: 0,
  },
});

type Props = {
  text: string;
};

const ControlHeader: React.FC<Props> = ({ text }) => {
  const classes = useStyles();
  return <h4 className={classes.header}>{text}</h4>;
};

export default ControlHeader;
