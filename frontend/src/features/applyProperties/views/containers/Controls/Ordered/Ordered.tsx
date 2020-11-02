import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import { AppReduxState } from '../../../../../../shared/types/app';
import { ListElement } from '../../../../../../api/types';
import {
  PropertiesChangeProps,
  withConfigurableProperties,
} from '../../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../../redux/project/selectors';

type StateProps = {
  isOrdered: boolean;
};

function mapState(state: AppReduxState): StateProps {
  const activeItemParams = selectActiveElementParams(state);

  return {
    isOrdered: activeItemParams.isOrdered,
  };
}

type Props = StateProps & PropertiesChangeProps<ListElement>;

const Ordered: React.FC<Props> = ({ isOrdered, updateParams }) => {
  const handleSwitchChange = () => {
    updateParams({ isOrdered: !isOrdered });
  };

  return (
    <div>
      <h4>Ordered</h4>

      <Switch size="small" checked={isOrdered} onChange={handleSwitchChange} />
    </div>
  );
};

export default connect(mapState)(withConfigurableProperties(Ordered));
