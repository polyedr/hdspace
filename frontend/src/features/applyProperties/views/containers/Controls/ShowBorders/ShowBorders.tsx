import React from 'react';
import { connect } from 'react-redux';
import Checkbox from '../../../components/Checkbox/Checkbox';
import { AppReduxState } from '../../../../../../shared/types/app';
import { toggleContainersBorders } from '../../../../../../redux/project/actions';
import { selectShowingBorders } from '../../../../../../redux/project/selectors';

const styles = require('./ShowBorders.scss');

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
    <label className={styles.label}>
      <Checkbox
        name="show borders"
        checked={showBorders}
        onChange={toggleBorders}
      />
      Show page blocks
    </label>
  );
};

export default connect(mapState, mapDispatch)(ShowBorders);
