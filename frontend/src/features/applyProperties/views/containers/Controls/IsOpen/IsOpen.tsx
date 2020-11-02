import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import { AppReduxState } from '../../../../../../shared/types/app';
import { DropdownElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';

type StateProps = {
  isOpen: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    isOpen: activeItemParams.isOpen,
  };
}

type Props = StateProps & PropertiesChangeProps<DropdownElement>;

const IsOpen: React.FC<Props> = ({ isOpen, updateParams }) => {
  const handleSwitchChange = () => {
    updateParams({ isOpen: !isOpen });
  };

  return (
    <div>
      <h4>Open component</h4>

      <Switch size="small" checked={isOpen} onChange={handleSwitchChange} />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(IsOpen));
