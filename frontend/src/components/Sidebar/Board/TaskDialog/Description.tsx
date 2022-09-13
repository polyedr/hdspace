import { ClickAwayListener } from '@material-ui/core';
import { Box, styled, Typography } from '@mui/material';
import { BoardTask } from '@Redux/pmtools/types';
import React, { useCallback, useMemo, useState } from 'react';
import Editor, { RenderEditorHtml } from './Comments/CommentEditor';

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

const InfoSubTitle = styled('p')({
  fontSize: 16,
  color: '#81818E',
});

interface Props {
  onSubmit(description: string): void;
  task: BoardTask;
}

const Description = ({ onSubmit, task }) => {
  const [editMode, setEditMode] = useState(false);

  const handleSetEditMode = useCallback(
    (mode: boolean) => {
      return () => setEditMode(mode);
    },
    [setEditMode],
  );

  const handleSaveDescription = useCallback((value) => {
    onSubmit(JSON.stringify(value));
    setEditMode(false);
  }, []);

  const parsedDescription = useMemo(() => {
    try {
      return JSON.parse(task.description);
    } catch (error) {

      console.log('json error', error);
      return null;
    }
  }, [task.description]);

  return editMode ? (
    // <TextareaAutosize
    //   aria-label="task description"
    //   placeholder="Add Description"
    //   onChange={handleChange}
    //   autoFocus
    //   onBlur={handleSaveDescription}
    //   value={description}
    // />
    <ClickAwayListener onClickAway={handleSetEditMode(false)}>
      <EditorWrapper>
        <Editor
          onSubmit={handleSaveDescription}
          placeholder="Add Description"
          value={parsedDescription}
        />
      </EditorWrapper>
    </ClickAwayListener>
  ) : (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <Box onClick={handleSetEditMode(true)}>
      {!parsedDescription ? (
        <InfoSubTitle>Add Description</InfoSubTitle>
      ) : (
        <RenderEditorHtml nodes={parsedDescription} />
      )}
    </Box>
  );
};

export default Description;
