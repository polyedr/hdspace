import {
  Grid,
  Stack,
  styled,
  Button as MuiButton,
  IconButton as MuiIconButton,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { BoardTask, BoardTaskComment } from '@Redux/pmtools/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { useDispatch } from 'react-redux';
import {
  deleteComment,
  requestUpdateComment,
} from '@Redux/pmtools/board/actions/comments';
import ConfirmModal from '@Components/Dialogs/PmToolsModal/ConfirmModal';
import Avatar from '@Components/UI/Avatar';
import Editor, { RenderEditorHtml } from '../Editor';
import { username } from '../../User';

const UssrAvatar = styled(Avatar)({
  width: 32,
  height: 32,
});

const CommentUserName = styled('h5')({
  fontSize: 14,
  fontWeight: 500,
  margin: '0 0 0 5px',
  color: '#2A2A2D',
});

const CommentTime = styled('h6')({
  fontSize: 12,
  color: '#81818E',
  margin: 0,
  fontWeight: 400,
  marginLeft: '10px !important',
});

const CommentText = styled('div')({
  '& p': {
    margin: '5px 5px 3px',
  },
});

const Button = styled(MuiButton)({
  fontSize: 12,
  minWidth: 'auto',
  textTransform: 'capitalize',

  '&.MuiButton-contained': {
    backgroundColor: 'var(--blue)',
    marginRight: 5,
  },

  '&.MuiButton-text': {
    color: '#81818E',
    padding: 5,

    '&:hover': {
      background: 'none',
    },
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

const EditorWrapper = styled('div')({
  border: '1px solid #E4E6EB',
  borderRadius: 4,
  padding: '12px 15px 10px',
  margin: '12px 0',

  '& p': {
    margin: '0 0 15px',
  },

  '& p span': {
    margin: 0,
    color: '#2A2A2D',
  },
});

interface Props {
  comment: BoardTaskComment;
  task: BoardTask;
}

const Comment = ({ comment, task }: Props) => {
  const [value, setValue] = useState(JSON.parse(comment.text) ?? undefined);
  const [editMode, setEditMode] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const dispatch = useDispatch();

  const handleSetEditMode = useCallback(
    (mode) => {
      return () => setEditMode(mode);
    },
    [setEditMode],
  );

  const handleDeleteComment = useCallback(() => {
    dispatch(deleteComment(comment.id, task));
  }, [comment]);

  const handleSave = useCallback(() => {
    dispatch(requestUpdateComment(JSON.stringify(value), comment.id, task));
    setEditMode(false);
  }, [comment, value, task]);

  const parsedValue = useMemo(() => {
    return JSON.parse(comment.text);
  }, [comment.text]);

  const handleShowDeleteConfirm = useCallback(
    (show) => {
      return () => setDeleteConfirm(show);
    },
    [setDeleteConfirm],
  );

  return (
    <>
      <Grid container spacing={1} mb={3}>
        <Grid item md="auto">
          <UssrAvatar
            uniqueKey={comment.user.id}
            alt={username(comment.user)}
            src={comment.user.profile_avatar}
            tooltipDisabled
          />
        </Grid>
        <Grid item md={11}>
          <Stack direction="row" spacing={2} alignItems="baseline">
            <CommentUserName>{username(comment.user)}</CommentUserName>
            <CommentTime className="Time">
              {formatDistanceToNowStrict(Date.parse(comment.created))} ago
            </CommentTime>
          </Stack>
          {editMode ? (
            <>
              <EditorWrapper>
                <Editor value={value} onChange={setValue} />
              </EditorWrapper>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Button onClick={handleSave} variant="contained">
                  Save
                </Button>
                <IconButton>
                  <CircleIcon />
                </IconButton>
                <Button onClick={handleSetEditMode(false)} variant="text">
                  Cancel
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <CommentText>
                <RenderEditorHtml nodes={parsedValue} />
              </CommentText>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Button onClick={handleSetEditMode(true)} variant="text">
                  Edit
                </Button>
                <IconButton>
                  <CircleIcon />
                </IconButton>
                <Button onClick={handleShowDeleteConfirm(true)} variant="text">
                  Delete
                </Button>
              </Stack>
            </>
          )}
        </Grid>
      </Grid>
      <ConfirmModal
        show={deleteConfirm}
        action={handleDeleteComment}
        elementText="Comment"
        hide={handleShowDeleteConfirm(false)}
        actionText="Delete"
      />
    </>
  );
};

export default Comment;
