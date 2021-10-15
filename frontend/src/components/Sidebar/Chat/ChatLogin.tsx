import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@material-ui/core';
import { PanelTextField } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { requestLoginChatUser } from '@Redux/pmtools/chat/actions';

const ChatLogin: React.FC = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState({
    password: '',
  });

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(requestLoginChatUser(login));
  };

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      name === 'realm'
        ? value.replace(/^(https?)|(:)|(\.zulipchat)|(\.com)|(\/)|(@)/gi, '')
        : value;
    setLogin((prevState) => ({ ...prevState, [name]: newValue }));
  };

  return (
    <form onSubmit={handleSignIn}>
      <PanelTextField
        type="password"
        name="password"
        required
        value={login.password}
        onChange={handleChange}
        label="Password"
      />

      <Button type="submit" color="secondary" variant="contained" fullWidth>
        Login
      </Button>
    </form>
  );
};

export default ChatLogin;
