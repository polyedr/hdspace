import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleGrid } from '@Redux/project/actions';
import { selectShowingGrid } from '@Redux/project/selectors/base';

import { FormControlLabel, Typography, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ typography }) => ({
  title: {
    fontSize: typography.fontSize,
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
      label={<Typography className={classes.title}>Show Grid</Typography>}
    />
  );
};

export default ShowGrid;
