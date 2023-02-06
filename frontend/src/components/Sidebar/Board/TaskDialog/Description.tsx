import {
  Box as MuiBox,
  Button as MuiButton,
  ClickAwayListener,
  Stack,
  styled,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { BoardTask } from '@Redux/pmtools/types';
import Editor, { RenderEditorHtml } from './Editor';

const Box = styled(MuiBox)({
  border: '1px solid #c4c4c4',
  padding: '12px 15px 10px',
  borderRadius: 4,
  marginBottom: 10,

  '&:hover': {
    border: '1px solid #000000',
  },

  '& p': {
    margin: 0,
  },
});

const EditorWrapper = styled('div')({
  border: '1px solid #c4c4c4',
  borderRadius: 4,
  padding: '12px 15px 10px',

  '& p': {
    margin: '0 0px 15px',
  },

  '& p span': {
    margin: 0,
    color: '#2A2A2D',
  },
});

const InfoSubTitle = styled('p')({
  fontSize: 14,
  color: '#a2a2a2',
});

const Button = styled(MuiButton)({
  textTransform: 'capitalize',

  '&.MuiButton-text': {
    color: '#81818E',
  },

  '&.MuiButton-contained': {
    backgroundColor: 'var(--blue)',
  },
});

interface Props {
  onSubmit: (description: string) => void;
  task: BoardTask;
}

const Description: React.FC<Props> = ({ onSubmit, task }) => {
  const [value, setValue] = useState(JSON.parse(task.description) ?? null);

  const [editMode, setEditMode] = useState(false);

  const handleSetEditMode = useCallback(
    (mode: boolean) => () => setEditMode(mode),
    [setEditMode],
  );

  const handleChangeValue = useCallback(
    (value) => {
      setValue(value);
    },
    [setValue],
  );

  const handleSaveDescription = useCallback(() => {
    onSubmit(JSON.stringify(value));
    setEditMode(false);
  }, [value]);

  return editMode ? (
    <ClickAwayListener onClickAway={handleSetEditMode(false)}>
      <div>
        <EditorWrapper>
          <Editor
            placeholder="Add Description"
            value={value}
            onChange={handleChangeValue}
          />
        </EditorWrapper>
        <Stack direction="row" spacing={2} mt={2} mb={1}>
          <Button onClick={handleSaveDescription} variant="contained">
            Save
          </Button>
          <Button onClick={handleSetEditMode(false)} variant="text">
            Cancel
          </Button>
        </Stack>
      </div>
    </ClickAwayListener>
  ) : (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <Box onClick={handleSetEditMode(true)}>
      {!value ? (
        <InfoSubTitle>Add Description</InfoSubTitle>
      ) : (
        <RenderEditorHtml nodes={value} />
      )}
    </Box>
  );
};

export default Description;
