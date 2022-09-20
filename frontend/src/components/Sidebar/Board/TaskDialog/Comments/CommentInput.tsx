import React, { useCallback, useState } from 'react';
import {
  Avatar as MuiAvatar,
  ClickAwayListener,
  Grid,
  styled,
  TextField as MuiTextField,
  Typography as MuiTypography,
} from '@mui/material';
import { BoardTask } from '@Redux/pmtools/types';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectProfileData } from '@Redux/user/selectors';
import Editor from '../Editor';
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
    margin: '0 0 12px',
  },

  '& p span': {
    margin: 0,
    // color: '#2A2A2D',
  },
});

const Typography = styled(MuiTypography)({
  border: '1px solid #E4E6EB',
  padding: '6.5px 12px',
  borderRadius: 4,
  color: '#81818E',
  fontSize: 14,
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
      <Grid item md={11}>
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
