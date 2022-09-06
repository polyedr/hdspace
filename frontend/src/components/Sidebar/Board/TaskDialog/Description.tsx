import { TextareaAutosize } from '@mui/material';
import React, { useCallback, useState } from 'react';

const Description = () => {
  const [editMode, setEditMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTaskTitle(e.target.value.trim());
    },
    [],
  );

  const handleSetEditMode = useCallback(
    (mode: boolean) => {
      return () => setEditMode(mode);
    },
    [setEditMode],
  );

  const handleSaveDescription = useCallback(() => {
    // TODO: save description logic
    setEditMode(false);
  }, []);

  return editMode ? (
    <TextareaAutosize
      aria-label="task description"
      placeholder="Add Description"
      onChange={handleChange}
      autoFocus
      style={{ border: 'none' }}
      onBlur={handleSaveDescription}
    />
  ) : (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <p onClick={handleSetEditMode(true)}>Add Description</p>
  );
};

export default Description;
