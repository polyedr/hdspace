import React from 'react';
import * as MIcons from '@mui/icons-material';
import { MenuItem } from '@mui/material';
import { StyledTextField } from '@Components/styledComponents';
import { IconElement, PropertiesChangeProps } from '@Src/types';
import {
  useDebouncedInputChange,
  useDebouncedValueChange,
} from '@Utils/debounceHooks';
import ColorSettings from '../../helperComponents/ColorSettings';

const Icon: React.FC<PropertiesChangeProps<IconElement>> = ({
  updateParams,
  canEdit,
  element,
}) => {
  const {
    name: initialName,
    size: initialSize,
    iconColor = '#000',
  } = element.parameters;

  const [name, handleNameChange] = useDebouncedInputChange(
    initialName || '',
    (value) => {
      updateParams({ name: value });
    },
  );

  const [size, handleSizeChange] = useDebouncedInputChange(
    initialSize || '',
    (value) => {
      updateParams({ size: Number(value) });
    },
  );

  const [iconColorValue, handleBorderColorChange] = useDebouncedValueChange(
    iconColor,
    (newIconColor: string) => {
      updateParams({ iconColor: newIconColor });
    },
  );

  return (
    <>
      <StyledTextField
        variant="outlined"
        value={name}
        onChange={handleNameChange}
        label="Name"
        margin="dense"
        fullWidth
        select
        disabled={!canEdit}
      >
        {Object.keys(MIcons).map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </StyledTextField>
      <StyledTextField
        variant="outlined"
        value={size}
        onChange={handleSizeChange}
        label="Size"
        margin="dense"
        fullWidth
        disabled={!canEdit}
      />

      <ColorSettings
        currentColor={iconColorValue as string}
        activeElementId={element.id}
        onChange={handleBorderColorChange as (newIconColor: string) => void}
        disabled={!canEdit}
      />
    </>
  );
};

export default Icon;
