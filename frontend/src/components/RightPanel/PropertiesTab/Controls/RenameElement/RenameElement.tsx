import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveElement } from '@Redux/project/selectors/element';
import { updateElement } from '@Redux/project/actions';
import { StyledTextField } from '@Components/styledComponents';
import useDebouncedChange from '@Utils/useDeboucedChange';

const RenameElement: React.FC = () => {
  const dispatch = useDispatch();

  const { name, id } = useSelector(selectActiveElement);

  const [state, handleChange] = useDebouncedChange(name || '', (value) => {
    dispatch(
      updateElement({ elementID: id, data: { name: value }, active: true }),
    );
  });

  return (
    <StyledTextField
      fullWidth
      margin="dense"
      label="Name"
      value={state}
      onChange={handleChange}
    />
  );
};

export default RenameElement;
