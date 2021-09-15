import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@material-ui/core';
import { PanelTextField } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { logIn } from '@Redux/pmtools/chat/actions';

const ChatLogin: React.FC = () => {
  const dispatch = useDispatch();
  const [password, setPasswordInput] = useState('');
  const [realm, setRealmInput] = useState('');
  const [email, setEmailInput] = useState('');

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(logIn(realm, email, password));
  };

  return (
    <form onSubmit={handleSignIn}>
      <PanelTextField
        required
        value={realm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setRealmInput(e.target.value)
        }
        label="Zulip domain name"
        helperText={`https://${realm || '[yourURL]'}.zulipchat.com/`}
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
