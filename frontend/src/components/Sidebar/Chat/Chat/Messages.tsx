/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-cycle */
import { PanelTextField } from '@Components/styledComponents';
import { configUser } from '@Constants/configZulipChat';
import { Button, IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { IMessageZulip } from '@Src/types/pmtools/zulipTypes';
import React, { useCallback, useEffect, useState } from 'react';
import zulipInit from 'zulip-js';
import { useSelector } from 'react-redux';
import { selectUserData } from '@Redux/user/selectors';
import Message from './Message';
import Users from './Users';

const Messages: React.FC<any> = ({ userId, partnerId }) => {
  const [users, setUsers] = useState(false);
  const [messages, setMessages] = useState<Array<IMessageZulip> | null>(null);
  const [message, setMessage] = useState<IMessageZulip['content']>('');
  const { email, profile } = useSelector(selectUserData);
  const config = configUser(email, profile.parameters.passwordZulip);

  const hadlerFetchMessages = useCallback(async () => {
    const client = await zulipInit(config);

    const readParams = {
      anchor: 'newest',
      num_before: 8,
      num_after: 0,
      narrow: [{ operator: 'pm-with', operand: [userId, partnerId] }],
    };
    const data = await client.messages.retrieve(readParams);
    setMessages(data.messages);
  }, [partnerId]);

  const handleSend = useCallback(async () => {
    const client = await zulipInit(config);
    const params = {
      to: [partnerId],
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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <IconButton color="primary" onClick={() => setUsers(true)}>
        <KeyboardBackspaceIcon />
      </IconButton>
      {!messages.length ? (
        <p>Not found</p>
      ) : (
        messages.map((m: IMessageZulip) => {
          const side =
            m.display_recipient[1].full_name !== m.sender_full_name
              ? 'left'
              : 'right';
          return <Message key={m.id} message={m} side={side} />;
        })
      )}
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
