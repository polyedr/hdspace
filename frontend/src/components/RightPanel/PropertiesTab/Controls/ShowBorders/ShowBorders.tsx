import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { toggleContainersBorders } from '../../../../../redux/project/actions';
import { selectShowingBorders } from '../../../../../redux/project/selectors';

const ShowBorders: React.FC = () => {
  const showBorders = useSelector(selectShowingBorders);
  const dispatch = useDispatch();
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="show borders"
          checked={showBorders}
          onChange={() => dispatch(toggleContainersBorders())}
        />
      }
      label="Show blocks"
    />
  );
};

export default ShowBorders;
