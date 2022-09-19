import React, { useCallback, useState } from 'react';
import {
  Avatar as MuiAvatar,
  ClickAwayListener,
  Grid,
  styled,
  TextField as MuiTextField,
} from '@mui/material';
import { Typography } from '@material-ui/core';
import Editor from '../Editor';
import { BoardTask } from '@Redux/pmtools/types';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectProfileData } from '@Redux/user/selectors';
import { username } from '../../User';

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

interface Props {
  onSubmit(value: any): void;
}

const CommentInput = ({ onSubmit }: Props) => {
  const [value, setValue] = useState(undefined);
  const [showEditor, setShowEditor] = useState(false);

  const user = useSelector(selectProfileData);

  const handleChange = useCallback(
    (value) => {
      setValue(value);
    },
    [setValue],
  );

  const handleSubmit = useCallback(() => {
    onSubmit(value);
    setShowEditor(false);
    setValue(undefined);
  }, [onSubmit, setValue, value]);

  return (
    <Grid container spacing={1}>
      <Grid item md="auto">
        <Avatar alt={username(user)} src={user.avatar ?? undefined} />
      </Grid>
      <Grid item md={10}>
        {showEditor ? (
          <CommentField>
            <ClickAwayListener onClickAway={() => setShowEditor(false)}>
              <div>
                <Editor
                  value={value}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
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
          <Typography onClick={() => setShowEditor(true)}>
            Add a Comment
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default CommentInput;
