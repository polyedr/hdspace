import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '../../../components/TextField/TextField';
import {
  selectActiveElement,
  selectCurrentScreenId,
} from '../../../../../../redux/project/selectors';
import { renameElement } from '../../../../../../redux/project/actions';

const RenameElement: React.FC = () => {
  const dispatch = useDispatch();

  const activeElement = useSelector(selectActiveElement);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const [currentElementName, setCurrentElementName] = useState(
    activeElement.name,
  );

  useEffect(() => {
    setCurrentElementName(activeElement.name);
  }, [activeElement.name]);

  const handleTextFieldBlur = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) =>
    dispatch(
      renameElement(activeElement.id, value, { screenId: currentScreenId }),
    );

  return (
    <TextField
      value={currentElementName}
      onBlur={handleTextFieldBlur}
      onChange={({ target: { value } }) => setCurrentElementName(value)}
    />
  );
};

export default RenameElement;
