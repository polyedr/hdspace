import {
  Avatar as MuiAvatar,
  Grid,
  Stack,
  styled,
  Button as MuiButton,
  IconButton as MuiIconButton,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { BoardTaskComment } from '@Redux/pmtools/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { RenderEditorHtml } from '../Editor';
import { username } from '../../User';

const Avatar = styled(MuiAvatar)({
  width: 32,
  height: 32,
});

const CommentUserName = styled('h5')({
  fontSize: 14,
  fontWeight: 600,
  margin: 0,
  color: '#2A2A2D',
});

const CommentTime = styled('h6')({
  fontSize: 12,
  color: '#81818E',
  margin: 0,
  fontWeight: 400,
});

const CommentText = styled('div')({
  '& p': {
    margin: '5px 0',
  },
});

const Button = styled(MuiButton)({
  fontSize: 12,
  color: '#81818E',
  padding: 0,
  minWidth: 'auto',
  textTransform: 'capitalize',

  '&:hover': {
    background: 'none',
  },
});

const IconButton = styled(MuiIconButton)({
  cursor: 'inherit',
  padding: 0,

  '& svg': {
    fontSize: 3,
    color: '#81818E',
  },
});

interface Props {
  comment: BoardTaskComment;
}

const Comment = ({ comment }: Props) => {
  const [editMode, setEditMode] = useState(false);

  const handleSetEditMode = useCallback(
    (mode) => {
      return () => setEditMode(mode);
    },
    [setEditMode],
  );

  return (
    <Grid container spacing={1} mb={3}>
      <Grid item md="auto">
        <Avatar
          alt={username(comment.user)}
          src={comment.user.profile_avatar}
        />
      </Grid>
      <Grid item md={10}>
        <Stack direction="row" spacing={2} alignItems="baseline">
          <CommentUserName>{username(comment.user)}</CommentUserName>
          <CommentTime className="Time">
            {formatDistanceToNowStrict(Date.parse(comment.created))} ago
          </CommentTime>
        </Stack>
        <CommentText>
          <RenderEditorHtml nodes={JSON.parse(comment.text)} />
        </CommentText>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Button onClick={handleSetEditMode(true)} variant="text">
            Edit
          </Button>
          <IconButton>
            <CircleIcon />
          </IconButton>
          <Button onClick={handleSetEditMode(false)} variant="text">
            Delete
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Comment;
