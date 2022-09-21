import React, { useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { BoardTask } from '@Redux/pmtools/types';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '@Redux/pmtools/board/actions/comments';
import { selectComments } from '@Redux/pmtools/board/selectors';
import CommentInput from './CommentInput';
import Comment from './Comment';

const CommentHistory = styled('div')({
  margin: '20px 0',

  '& p.MainComment': {
    color: '#2A2A2D',
    margin: '10px 0',
  },
});

interface Props {
  task: BoardTask;
}

const Comments = ({ task }: Props) => {
  const dispatch = useDispatch();

  const comments = useSelector(selectComments(task));

  const handleSubmit = useCallback(
    (value) => {
      dispatch(createComment(JSON.stringify(value), task));
    },
    [task],
  );

  return (
    <>
      <CommentInput onSubmit={handleSubmit} />
      <CommentHistory>
        {comments.map((comment) => (
          <Comment key={comment.id} task={task} comment={comment} />
        ))}
      </CommentHistory>
    </>
  );
};

export default Comments;
