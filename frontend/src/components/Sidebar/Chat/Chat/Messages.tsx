/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-cycle */
import { PanelTextField } from '@Components/styledComponents';
import config from '@Constants/configZulipChat';
import { Button, IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { IMessageZulip } from '@Src/types/pmtools/zulipTypes';
import React, { useCallback, useEffect, useState } from 'react';
import zulipInit from 'zulip-js';
import { useSelector } from 'react-redux';
import { selectUserData } from '@Redux/user/selectors';
import Message from './Message';
import Users from './Users';

const useStyles = makeStyles(({ palette }) => ({
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
    '&.Mui-disabled': {
      color: '#888',
    },
  },
}));

const Messages: React.FC<any> = ({ id, clientId }) => {
  const classes = useStyles();
  const [users, setUsers] = useState(false);
  const [messages, setMessages] = useState<Array<IMessageZulip> | null>(null);
  const [message, setMessage] = useState<IMessageZulip['content']>('');
  const profile = useSelector(selectUserData);

  const configThisUser = {
    realm: config.realm,
    username: profile.email,
    password: profile.profile.parameters.passwordZulip,
  };

  // getting a list of active users
  const hadlerFetchMessages = useCallback(async () => {
    const client = await zulipInit(configThisUser);

    const readParams = {
      anchor: 'newest',
      num_before: 5,
      num_after: 0,
      narrow: [{ operator: 'pm-with', operand: [clientId, id] }],
    };

    const data = await client.messages.retrieve(readParams);
    setMessages(data.messages);
  }, [id]);

  // sending a message
  const handleSend = useCallback(async () => {
    const client = await zulipInit(configThisUser);
    const params = {
      to: [id],
      type: 'private',
      content: message,
    };
    await client.messages.send(params);
    setMessage('');
  }, [message]);

  useEffect(() => {
    hadlerFetchMessages();
  }, [handleSend]);

  if (users) {
    return <Users />;
  }

  if (!messages) {
    return (
      <>
        <IconButton
          color="primary"
          className={classes.iconButton}
          onClick={() => setUsers(true)}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
        <p>Messages not found </p>
      </>
    );
  }

  return (
    <div>
      <IconButton
        color="primary"
        className={classes.iconButton}
        onClick={() => setUsers(true)}
      >
        <KeyboardBackspaceIcon />
      </IconButton>
      {messages.map((m: IMessageZulip) => (
        <Message
          key={m.id}
          message={m}
          side={
            m.display_recipient[1].full_name === m.sender_full_name
              ? 'right'
              : 'left'
          }
        />
      ))}
      <div style={{ position: 'fixed', bottom: 10 }}>
        <PanelTextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Messages;
