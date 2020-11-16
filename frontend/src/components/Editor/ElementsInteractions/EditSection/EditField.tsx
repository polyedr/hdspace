import React, { useState, useCallback } from 'react';
import { useSelector /* , useDispatch */ } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { selectElementById } from '../../../../redux/project/selectors';
import { BorderStyles } from '../../../../types';

type EditFieldProps = {
  elementId: string;
  styles: BorderStyles;
};

const EditField: React.FC<EditFieldProps> = ({ elementId /* , styles */ }) => {
  const element = useSelector(selectElementById(elementId));
  // const dispatch = useDispatch();
  const [value, setValue] = useState(element.parameters?.textContent);

  const debounceHandler = useDebouncedCallback((value) => {
    console.log('TEST!!!', value);
  }, 500);

  const handleSaveTextContent = useCallback(
    (event) => {
      setValue(event.target.value);
      debounceHandler.callback(event.target.value);
    },
    [setValue, debounceHandler],
  );

  return <input type="text" value={value} onChange={handleSaveTextContent} />;
};

export default EditField;
