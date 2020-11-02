import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import { AppReduxState } from '../../../../../../shared/types/app';
import { ButtonElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';

type StateProps = {
  showRipple: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    showRipple: activeItemParams.showRipple,
  };
}

type Props = StateProps & PropertiesChangeProps<ButtonElement>;

const Ripple: React.FC<Props> = ({ showRipple, updateParams }) => {
  const handleSwitchChange = () => {
    updateParams({ showRipple: !showRipple });
  };

  return (
    <div>
      <h4>Ripple effect</h4>

      <Switch size="small" checked={showRipple} onChange={handleSwitchChange} />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Ripple));
