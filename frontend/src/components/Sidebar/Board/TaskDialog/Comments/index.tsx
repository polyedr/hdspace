import React from 'react';
import { styled } from '@mui/material/styles';
import CommentInput from './CommentInput';
import Comment from './Comment';

const CommentHistory = styled('div')({
  margin: '20px 0',

  '& p.MainComment': {
    color: '#2A2A2D',
    margin: '10px 0',
  },
});

const Comments = () => {
  return (
    <>
      <CommentInput />
      <CommentHistory>
        <Comment />
      </CommentHistory>
    </>
  );
};

export default Comments;
