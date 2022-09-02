import React from 'react';
import {
  Avatar as MuiAvatar,
  Button as MuiButton,
  Dialog as MuiDialog,
  Grid,
  Stack,
  TextField as MuiTextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const Avatar = styled(MuiAvatar)({
  width: 32,
  height: 32,
});

const TextField = styled(MuiTextField)({
  '& .MuiOutlinedInput-root': {
    '& input': {
      padding: '6.5px 14px',
    },
    '& fieldset': {
      borderColor: '#E4E6EB !important',
    },
    '&:hover fieldset': {
      borderColor: 'var(--blue)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#E4E6EB',
    },
  },
});

const CommentHistory = styled('div')({
  margin: '20px 0',

  '& p.MainComment': {
    color: '#2A2A2D',
    margin: '10px 0',
  },
});

const CommentUserName = styled('h5')({
  fontSize: 14,
  fontWeight: 500,
  margin: 0,
  color: '#2A2A2D',
});

const CommentTime = styled('h6')({
  fontSize: 12,
  color: '#81818E',
  margin: 0,
  fontWeight: 400,
});

const Button = styled(MuiButton)({
  fontSize: 12,
  color: '#81818E',
  padding: 0,
  minWidth: 'auto',
  textTransform: 'capitalize',
});

export const Comment = () => {
  return (
    <div>
      <div>
        <Grid container spacing={1}>
          <Grid item md="auto">
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </Grid>
          <Grid item md={10}>
            <TextField
              type="text"
              placeholder="Add a comment"
              fullWidth
              size="small"
            />
          </Grid>
        </Grid>
      </div>
      <CommentHistory>
        <Grid container spacing={1}>
          <Grid item md="auto">
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </Grid>
          <Grid item md={10}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CommentUserName>Aleksandra Sayapina</CommentUserName>
              <CommentTime className="Time">3 minutes ago</CommentTime>
            </Stack>
            <p className="MainComment">
              Let's move the deadline by a couple of days, we don't have time
              now
            </p>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button variant="text">Edit</Button>
              <span>.</span>
              <Button variant="text">Delete</Button>
            </Stack>
          </Grid>
        </Grid>
      </CommentHistory>
    </div>
  );
};
