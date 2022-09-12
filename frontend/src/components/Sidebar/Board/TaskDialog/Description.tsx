import { styled, TextareaAutosize } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Editor from './Comments/CommentEditor';

const EditorWrapper = styled('div')({
  border: '1px solid #E4E6EB',
  borderRadius: 4,
  padding: 12,

  '& p': {
    margin: '0 12px 12px',
  },

  '& p span': {
    margin: 0,
    color: '#2A2A2D',
  },
});

const Description = () => {
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value.trim());
    },
    [setDescription],
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
    // <TextareaAutosize
    //   aria-label="task description"
    //   placeholder="Add Description"
    //   onChange={handleChange}
    //   autoFocus
    //   onBlur={handleSaveDescription}
    //   value={description}
    // />
    <EditorWrapper>
      <Editor />
    </EditorWrapper>
  ) : (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <p onClick={handleSetEditMode(true)}>Add Description</p>
  );
};

export default Description;
