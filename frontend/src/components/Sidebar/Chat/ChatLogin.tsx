import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { PanelTextField } from '@Components/styledComponents';

const ChatLogin: React.FC = () => {
  const authPending = false;
  const [password, setPasswordInput] = useState('');
  const [realm, setRealmInput] = useState('');
  const [email, setEmailInput] = useState('');

  const handleSignIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        {authPending ? (
          <>
            <CircularProgress
              color="secondary"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span>Loading</span>
          </>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
};

export default ChatLogin;
