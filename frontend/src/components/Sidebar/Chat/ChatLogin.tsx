import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@material-ui/core';
import { PanelTextField } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { requestLoginChatUser } from '@Redux/pmtools/chat/actions';

const ChatLogin: React.FC = () => {
  const dispatch = useDispatch();
  const [password, setPasswordInput] = useState('');
  const [realm, setRealmInput] = useState('');
  const [email, setEmailInput] = useState('');

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(requestLoginChatUser({ realm, email, password }));
  };

  const handleRealmInput = (e: ChangeEvent<HTMLInputElement>) => {
    const rlm = e.target.value;
    setRealmInput(
      rlm.replace(/^(https?)|(:)|(\.zulipchat)|(\.com)|(\/)|(@)/gi, ''),
    );
  };

  return (
    <form onSubmit={handleSignIn}>
      <PanelTextField
        required
        value={realm}
        onChange={handleRealmInput}
        label="Zulip domain name"
      />
      <PanelTextField
        type="email"
        required
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmailInput(e.target.value)
        }
        label="Email address"
      />
      <PanelTextField
        type="password"
        required
        value={password}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPasswordInput(e.target.value)
        }
        label="Password"
      />

      <Button type="submit" color="secondary" variant="contained" fullWidth>
        Login
      </Button>
    </form>
  );
};

export default ChatLogin;
