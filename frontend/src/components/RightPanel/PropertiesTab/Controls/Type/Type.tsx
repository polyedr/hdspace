import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import withConfigurableProperties from '@Utils/withConfigurableProperties';
import TYPE from './constants';

import {
  InputType,
  PropertiesChangeProps,
  TextinputElement,
} from '../../../../../types';
import { StyledTextField } from '../../../../styledComponents';

const Type: React.FC<PropertiesChangeProps<TextinputElement>> = ({
  updateParams,
}) => {
  const type = useSelector(selectActiveElementParamByName('type'));
  const handleDropdownChange = (ev) => {
    updateParams({ type: ev.target.value as InputType });
  };

  return (
    <StyledTextField
      margin="dense"
      label="Type"
      defaultValue={type}
      value={type}
      onChange={handleDropdownChange}
      select
    >
      {TYPE.map(({ label, value }) => (
        <MenuItem value={value} key={value} dense>
          {label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default withConfigurableProperties(memo(Type));
