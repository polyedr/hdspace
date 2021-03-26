import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { ImageElement, PropertiesChangeProps } from '@Src/types';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { StyledTextField } from '@Components/styledComponents';
import useDebouncedChange from '@Utils/useDeboucedChange';

const Alt: FC<PropertiesChangeProps<ImageElement>> = ({ updateParams }) => {
  const alt = useSelector(selectActiveElementParamByName('alt'));

  const [state, handleChange] = useDebouncedChange(alt, (value) =>
    updateParams({ alt: value }),
  );

  return (
    <StyledTextField
      value={state || ''}
      variant="outlined"
      onChange={handleChange}
      label="Alt"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default Alt;
