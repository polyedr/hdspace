import React from 'react';
import { connect } from 'react-redux';

import { actionsCreators, selectors } from '$redux/project';
import { AppReduxState } from '$shared/types/app';
import { Checkbox } from '$features/applyProperties/views/components/Checkbox/Checkbox';

const styles = require('./ShowBorders.scss');

type StateProps = {
  showBorders: boolean;
};

const mapState = (state: AppReduxState) => {
  return {
    showBorders: selectors.selectShowingBorders(state),
  }
};

const mapDispatch = {
  toggleBorders: actionsCreators.toggleContainersBorders,
};

type Props = StateProps & typeof mapDispatch;

const ShowBorders = (props: Props) => {
  const { showBorders, toggleBorders } = props;

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

const Component = connect(mapState, mapDispatch)(ShowBorders);
export { Component as ShowBorders };
