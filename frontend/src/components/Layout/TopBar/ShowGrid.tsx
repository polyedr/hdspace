import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleGrid } from '@Redux/project/actions';
import { selectShowingGrid } from '@Redux/project/selectors/base';

import { FormControlLabel, Typography, Checkbox } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  title: {
    color: '#81818E',
    fontSize: '1rem',
  },
}));

const ShowGrid: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const showGrid = useSelector(selectShowingGrid);

  return (
    <FormControlLabel
      control={
        <Checkbox
          name="Show Grid"
          checked={showGrid}
          onChange={() => dispatch(toggleGrid(!showGrid))}
        />
      }
      label={<Typography className={classes.title}>Show grid</Typography>}
    />
  );
};

export default ShowGrid;
