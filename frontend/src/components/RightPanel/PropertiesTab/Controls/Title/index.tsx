import { selectActiveElementParamByName } from '@Redux/project/selectors/element';
import { ImageElement, PropertiesChangeProps } from '@Src/types';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const Title: FC<PropertiesChangeProps<ImageElement>> = ({
  updateParams,
  canEdit,
}) => {
  const title = useSelector(selectActiveElementParamByName('title'));

  const [state, handleChange] = useDebouncedInputChange(title, (value) =>
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
      disabled={!canEdit}
    />
  );
};

export default Title;
