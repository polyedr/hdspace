import React from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCanvasScrollInProgress,
  selectSyncBordersInProgress,
} from '@Redux/project/selectors/element';
import { toggleContainersBorders } from '@Redux/project/actions';
import {
  selectBordersEnabled,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import { selectIsPrototypeMode } from '@Redux/user/selectors';

type Props = {
  label: React.ReactNode;
};

const ShowBordersSection = ({ label }) => {
  const dispatch = useDispatch();
  const showBorders = useSelector(selectShowingBorders);
  const bordersEnabled = useSelector(selectBordersEnabled);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const syncBordersInProgress = useSelector(selectSyncBordersInProgress);
  const canvasScrollInProgress = useSelector(selectCanvasScrollInProgress);

  return !syncBordersInProgress && !canvasScrollInProgress ? (
    <FormControlLabel
      control={
        <Checkbox
          name="Show borders"
          checked={showBorders}
          disabled={!bordersEnabled && !isProtoMode}
          onChange={() => dispatch(toggleContainersBorders(!showBorders))}
        />
      }
      label={label}
    />
  ) : (
    <span>Loading...</span>
  );
};

export default ShowBordersSection;
