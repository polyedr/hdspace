import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveElementParams } from '@Redux/project/selectors/element';
import { AppReduxState } from '@Redux/types';
import { StyledTextField } from '@Components/styledComponents';
import { HTMLLibraryElement, PropertiesChangeProps } from '@Src/types';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

const TagName: React.FC<PropertiesChangeProps<HTMLLibraryElement>> = ({
  updateParams,
  canEdit,
}) => {
  const tagName = useSelector(
    (state: AppReduxState) => selectActiveElementParams(state).tag,
  );

  const [state, handleNameChange] = useDebouncedInputChange(
    tagName || '',
    (value) => {
      updateParams({ tag: value && value.length ? value : 'div' });
    },
  );

  return (
    <StyledTextField
      variant="outlined"
      value={state}
      onChange={handleNameChange}
      label="Name"
      margin="dense"
      fullWidth
      multiline
      disabled={!canEdit}
    />
  );
};

export default TagName;
