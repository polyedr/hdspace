import React, { useState } from 'react';
import {
  Avatar as MuiAvatar,
  Button,
  ClickAwayListener,
  Grid,
  styled,
  TextField as MuiTextField,
} from '@mui/material';
import Editor from './CommentEditor';

const Avatar = styled(MuiAvatar)({
  width: 32,
  height: 32,
});

const CommentField = styled('div')({
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
          <CommentField>
            <ClickAwayListener onClickAway={() => setShowEditor(false)}>
              <div>
                <Editor />
              </div>
            </ClickAwayListener>
            {/* <Button variant="text" size="small">
              Save
            </Button>
            <Button
              onClick={() => setShowEditor(false)}
              variant="text"
              size="small"
            >
              Cancel
            </Button> */}
          </CommentField>
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
