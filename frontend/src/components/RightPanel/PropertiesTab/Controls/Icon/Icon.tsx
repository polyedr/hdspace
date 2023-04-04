import React from 'react';
import { StyledTextField } from '@Components/styledComponents';
import { IconElement, PropertiesChangeProps } from '@Src/types';
import {
  useDebouncedInputChange,
  useDebouncedValueChange,
} from '@Utils/debounceHooks';
import ColorSettings from '../../helperComponents/ColorSettings';
import IconAutocomplete from './IconAutocomplete';

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

  const [name, handleNameChange] = useDebouncedValueChange(
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
      <IconAutocomplete
        onChange={(_, newValue) => {
          handleNameChange(newValue);
        }}
        value={name}
      />
      <StyledTextField
        variant="standard"
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
