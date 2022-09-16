import {
  Avatar as MuiAvatar,
  Grid,
  Stack,
  styled,
  Button as MuiButton,
  IconButton as MuiIconButton,
} from '@mui/material';
import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';

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

const Button = styled(MuiButton)({
  fontSize: 12,
  color: '#81818E',
  padding: 0,
  minWidth: 'auto',
  textTransform: 'capitalize',
});

const IconButton = styled(MuiIconButton)({
  '& svg': {
    fontSize: 3,
    color: '#81818E',
  },
});

const Comment = () => {
  return (
    <Grid container spacing={1} mb={3}>
      <Grid item md="auto">
        <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
      </Grid>
      <Grid item md={10}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CommentUserName>Aleksandra Sayapina</CommentUserName>
          <CommentTime className="Time">3 minutes ago</CommentTime>
        </Stack>
        <p className="MainComment">
          Let's move the deadline by a couple of days, we don't have time now
        </p>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Button variant="text">Edit</Button>
          <IconButton>
            <CircleIcon />
          </IconButton>
          <Button variant="text">Delete</Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Comment;
