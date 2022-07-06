import React, { useState } from 'react';
import { Button, TextField, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as action from '@Redux/pmtools/chat/actions';
import { selectProfileData } from '@Redux/user/selectors';

const ChatLogin: React.FC = () => {
  const dispatch = useDispatch();
  const { parameters } = useSelector(selectProfileData);

  const [password, setPassword] = useState(parameters.passwordZulip || '');
  const [isLogin, setIsLogin] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const zulipPasswordResetLink =
    'https://zulip.adevi.info/accounts/password/reset/';

  const handleRegister = () => {
    dispatch(action.requestRegisterZulip(password));
  };

  return (
    <>
      <TextField
        type={isVisible ? 'text' : 'password'}
        fullWidth
        label="Zulip Password"
        placeholder="Enter Password"
        variant="outlined"
        size="small"
        style={{ margin: '20px 0 0' }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <IconButton size="small" onClick={() => setVisible(!isVisible)}>
              {!isVisible ? (
                <Visibility fontSize="small" />
              ) : (
                <VisibilityOff fontSize="small" />
              )}
            </IconButton>
          ),
        }}
      />
      {parameters.passwordZulip || isLogin ? (
        <>
          <Button
            onClick={() => dispatch(action.requestLoginChatUser(password))}
            style={{ margin: '10px 0' }}
            type="submit"
            color="secondary"
            variant="contained"
            fullWidth
          >
            Login
          </Button>
          <Button target="_blank" href={zulipPasswordResetLink} fullWidth>
            Forgot password?
          </Button>
        </>
      ) : (
        <>
          <Button
            type="submit"
            color="secondary"
            style={{ margin: '10px 0' }}
            onClick={handleRegister}
            variant="contained"
            fullWidth
          >
            Register
          </Button>
          <Button fullWidth onClick={() => setIsLogin(!isLogin)}>
            Already registered?
          </Button>
        </>
      )}
    </>
  );
};

export default ChatLogin;
