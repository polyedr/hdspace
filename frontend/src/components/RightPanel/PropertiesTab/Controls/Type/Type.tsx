import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { MenuItem } from '@mui/material';
import TYPE from './constants';
import {
  InputType,
  PropertiesChangeProps,
  TextinputElement,
} from '../../../../../types';

import { StyledTextField } from '../../../../styledComponents';

const Type: React.FC<PropertiesChangeProps<TextinputElement>> = ({
  updateParams,
  canEdit,
}) => {
  const type = useSelector(selectActiveElementParamByName('type'));
  const handleDropdownChange = (ev) => {
    updateParams({ type: ev.target.value as InputType });
  };

  return (
    <StyledTextField
      margin="dense"
      label="Type"
      value={type}
      onChange={handleDropdownChange}
      select
      disabled={!canEdit}
    >
      {TYPE.map(({ label, value }) => (
        <MenuItem value={value} key={value} dense>
          {label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default memo(Type);
