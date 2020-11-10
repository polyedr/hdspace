import React from 'react';
import { connect } from 'react-redux';
import { FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { toggleContainersBorders } from '../../../../../redux/project/actions';
import { selectShowingBorders } from '../../../../../redux/project/selectors';
import { AppReduxState } from '../../../../../redux/types';

type StateProps = {
  showBorders: boolean;
};

const mapState = (state: AppReduxState) => {
  return {
    showBorders: selectShowingBorders(state),
  };
};

const mapDispatch = {
  toggleBorders: toggleContainersBorders,
};

type Props = StateProps & typeof mapDispatch;

const ShowBorders: React.FC<Props> = ({ showBorders, toggleBorders }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          name="show borders"
          checked={showBorders}
          onChange={toggleBorders}
        />
      }
      label="Show blocks"
    />
  );
};

export default connect(mapState, mapDispatch)(ShowBorders);
