import React from 'react';
import { connect } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import { ListElement, PropertiesChangeProps } from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

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
    <FormControlLabel
      control={<Switch checked={isOrdered} onChange={handleSwitchChange} />}
      label="Is Ordered"
    />
  );
};

export default connect(mapState)(withConfigurableProperties(Ordered));
