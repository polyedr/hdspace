import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { selectActiveElement } from '../../../../../redux/project/selectors';
import { updateElement } from '../../../../../redux/project/actions';

const RenameElement: React.FC = () => {
  const dispatch = useDispatch();

  const activeElement = useSelector(selectActiveElement);

  const [currentElementName, setCurrentElementName] = useState(
    activeElement.name,
  );

  useEffect(() => {
    setCurrentElementName(activeElement.name);
  }, [activeElement.name]);

  const handleTextFieldBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) =>
    dispatch(updateElement(activeElement.id, { name: value }, true));

  return (
    <TextField
      label="Name"
      value={currentElementName}
      onBlur={handleTextFieldBlur}
      onChange={({ target: { value } }) => setCurrentElementName(value)}
    />
  );
};

export default RenameElement;
