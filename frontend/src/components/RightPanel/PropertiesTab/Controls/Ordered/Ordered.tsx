import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Switch } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import withConfigurableProperties from '../../../../../utils/withConfigurableProperties';
import { selectActiveElementParams } from '../../../../../redux/project/selectors';
import { ListElement, PropertiesChangeProps } from '../../../../../types';
import { AppReduxState } from '../../../../../redux/types';

const Ordered: React.FC<PropertiesChangeProps<ListElement>> = ({
  updateParams,
}) => {
  const isOrdered = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).isOrdered,
  );
  const handleSwitchChange = useCallback(() => {
    updateParams({ isOrdered: !isOrdered });
  }, [updateParams, isOrdered]);

  return (
    <FormControlLabel
      control={<Switch checked={isOrdered} onChange={handleSwitchChange} />}
      label="Is Ordered"
    />
  );
};

export default withConfigurableProperties(Ordered);
