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
      <>
        <h4>Welcome to the chat!</h4>
        <Button
          onClick={() =>
            dispatch(action.requestLoginChatUser(parameters.passwordZulip))
          }
          type="submit"
          color="secondary"
          variant="contained"
          fullWidth
        >
          Login
        </Button>
      </>
    );
  }

  return (
    <>
      <h4>Register to the chat!</h4>
      <Button
        type="submit"
        color="secondary"
        onClick={() => dispatch(action.requestRegisterZulip())}
        variant="contained"
        fullWidth
      >
        Register
      </Button>
    </>
  );
};

export default ChatLogin;
