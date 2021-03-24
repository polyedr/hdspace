import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { ImageElement, PropertiesChangeProps } from '@Src/types';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { StyledTextField } from '@Components/styledComponents';
import useDebouncedChange from '@Utils/useDeboucedChange';

const Title: FC<PropertiesChangeProps<ImageElement>> = ({ updateParams }) => {
  const title = useSelector(selectActiveElementParamByName('title'));

  const [state, handleChange] = useDebouncedChange(title, (value) =>
    updateParams({ title: value }),
  );

  return (
    <StyledTextField
      value={state || ''}
      variant="outlined"
      onChange={handleChange}
      label="Title"
      margin="dense"
      fullWidth
      multiline
    />
  );
};

export default Title;
