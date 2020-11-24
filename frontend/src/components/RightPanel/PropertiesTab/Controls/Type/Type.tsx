import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import TYPE from './constants';

import {
  InputType,
  PropertiesChangeProps,
  TextinputElement,
} from '../../../../../types';

const Type: React.FC<PropertiesChangeProps<TextinputElement>> = ({
  updateParams,
}) => {
  const type = useSelector(selectActiveElementParamByName('type'));
  const handleDropdownChange = (ev) => {
    updateParams({ type: ev.target.value as InputType });
  };

  return (
    <FormControl margin="dense">
      <InputLabel>Type</InputLabel>

      <Select defaultValue={type} value={type} onChange={handleDropdownChange}>
        {TYPE.map(({ label, value }) => (
          <MenuItem value={value} key={value} dense>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default withConfigurableProperties(memo(Type));
