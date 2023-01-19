import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { ImageElement, PropertiesChangeProps } from '@Src/types';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const Alt: FC<PropertiesChangeProps<ImageElement>> = ({
  updateParams,
  canEdit,
}) => {
  const alt = useSelector(selectActiveElementParamByName('alt'));

  const [state, handleChange] = useDebouncedInputChange(alt, (value) =>
    updateParams({ alt: value }),
  );

  return (
    <StyledTextField
      value={state || ''}
      onChange={handleChange}
      label="Alt"
      margin="dense"
      fullWidth
      multiline
      disabled={!canEdit}
    />
  );
};

export default Alt;
