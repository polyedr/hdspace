import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { selectActiveElement } from '../../../../../redux/project/selectors';
import { updateElement } from '../../../../../redux/project/actions';
import { StyledTextField } from '../../../../styledComponents';

const RenameElement: React.FC = () => {
  const dispatch = useDispatch();

  const { name, id } = useSelector(selectActiveElement);

  const [state, setState] = useState(name);
  useEffect(() => {
    setState(name);
  }, [name]);

  const debounced = useDebouncedCallback((value) => {
    dispatch(updateElement(id, { name: value }, true));
  }, 500);

  return (
    <StyledTextField
      fullWidth
      margin="dense"
      label="Name"
      value={state}
      onChange={({ target: { value } }) => {
        setState(value);
        debounced.callback(value);
      }}
    />
  );
};

export default RenameElement;
