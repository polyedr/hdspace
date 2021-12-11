import React from 'react';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as action from '@Redux/pmtools/chat/actions';
import { selectProfileData } from '@Redux/user/selectors';

const ChatLogin: React.FC = () => {
  const dispatch = useDispatch();
  const { parameters } = useSelector(selectProfileData);

  if (parameters.passwordZulip) {
    return (
      <Button
        onClick={() =>
          dispatch(action.requestLoginChatUser(parameters.passwordZulip))
        }
        style={{ margin: '10px 0' }}
        type="submit"
        color="secondary"
        variant="contained"
        fullWidth
      >
        Login
      </Button>
    );
  }

  return (
    <Button
      type="submit"
      color="secondary"
      style={{ margin: '10px 0' }}
      onClick={() => dispatch(action.requestRegisterZulip())}
      variant="contained"
      fullWidth
    >
      Register
    </Button>
  );
};

export default ChatLogin;
