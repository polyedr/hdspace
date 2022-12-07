import React from 'react';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@mui/material/TextField';
import { RightArrowIcon, DownArrowIcon, ColumnIcon, RowIcon } from './icons';

const useStyles = makeStyles(() => ({
  flexParent: {
    padding: '8px 12px',
  },
  buttonGroup: {
    display: 'flex',
    gap: 4,
  },
  iconBox: {
    width: 28,
    height: 28,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  inputGroup: {
    display: 'flex',
  },
  inputWithIcon: {
    height: 28,
    backgroundColor: '#E4E6EB',
    borderRadius: 4,
  },
}));

const FlexConstraints: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.flexParent}>
      <div className={classes.buttonGroup}>
        <IconButton className={classes.iconBox}>
          <RightArrowIcon />
        </IconButton>
        <IconButton className={classes.iconBox}>
          <DownArrowIcon />
        </IconButton>
      </div>
      <div className={classes.inputGroup}>
        <div className={classes.inputWithIcon}>
          <RowIcon />
          <TextField label="Outlined" />
        </div>
        <div className={classes.inputWithIcon}>
          <ColumnIcon />
          <TextField label="Outlined" />
        </div>
      </div>
    </div>
  );
};

export default FlexConstraints;
