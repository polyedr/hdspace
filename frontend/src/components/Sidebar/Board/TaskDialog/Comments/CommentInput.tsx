import React, { useState } from 'react';
import {
  Avatar as MuiAvatar,
  Button,
  Grid,
  styled,
  TextField as MuiTextField,
} from '@mui/material';
import Editor from './CommentEditor';

const Avatar = styled(MuiAvatar)({
  width: 32,
  height: 32,
});

const TextField = styled(MuiTextField)({
  '& .MuiOutlinedInput-root': {
    '& input': {
      padding: '6.5px 14px',
    },
    '& > fieldset': {
      borderColor: '#E4E6EB !important',
    },
    '&:hover > fieldset': {
      borderColor: 'var(--blue)',
    },
    '&.Mui-focused > fieldset': {
      borderColor: '#E4E6EB',
    },
  },
});

const CommentInput = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <Grid container spacing={1}>
      <Grid item md="auto">
        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
      </Grid>
      <Grid item md={10}>
        {showEditor ? (
          <div>
            <Editor />
            <Button>Save</Button>
            <Button onClick={() => setShowEditor(false)}>Cancel</Button>
          </div>
        ) : (
          <TextField
            type="text"
            placeholder="Add a comment"
            fullWidth
            size="small"
            onFocus={() => setShowEditor(true)}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default CommentInput;
