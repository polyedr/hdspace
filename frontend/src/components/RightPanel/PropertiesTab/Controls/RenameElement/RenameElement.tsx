import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { updateElement } from '@Redux/project/actions';
import { StyledTextField } from '@Components/styledComponents';
import { useDebouncedInputChange } from '@Utils/debounceHooks';

interface Props {
  canEdit: boolean;
}

const RenameElement: React.FC<Props> = ({ canEdit }) => {
  const dispatch = useDispatch();

  const { name, id } = useSelector(selectActiveElement);

  const [state, handleChange] = useDebouncedInputChange(name || '', (value) => {
    dispatch(
      updateElement({ elementID: id, data: { name: value }, active: true }),
    );
  });

  return (
    <div>
      <StyledTextField
        fullWidth
        margin="dense"
        value={state}
        onChange={handleChange}
        disabled={!canEdit}
      />
    </div>
  );
};

export default RenameElement;
