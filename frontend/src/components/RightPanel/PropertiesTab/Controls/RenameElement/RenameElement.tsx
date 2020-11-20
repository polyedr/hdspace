import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { useDebounce } from 'use-debounce';
import { selectActiveElement } from '../../../../../redux/project/selectors';
import { updateElement } from '../../../../../redux/project/actions';

const RenameElement: React.FC = () => {
  const dispatch = useDispatch();

  const { name, id } = useSelector(selectActiveElement);

  const [state, setState] = useState(name);
  const [debouncedState] = useDebounce(state, 500);

  useEffect(() => {
    dispatch(updateElement(id, { name: debouncedState }, true));
  }, [debouncedState, dispatch, id]);

  return (
    <TextField
      label="Name"
      value={state}
      onChange={({ target: { value } }) => setState(value)}
    />
  );
};

export default RenameElement;
