/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import zulipInit from 'zulip-js';
import LogoutIcon from '@mui/icons-material/Logout';
import { IMessageZulip, IStream } from '@Src/types/pmtools/zulipTypes';
import { configUser } from '@Constants/configZulipChat';
import { requestLogoutChatUser } from '@Redux/pmtools/chat/actions';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserData } from '@Redux/user/selectors';
import { PanelTextField, SideBarTitle } from '@Components/styledComponents';
import { Button } from '@material-ui/core';
import Message from './Message';

const Users: React.FC = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<IStream>([]);
  const [message, setMessage] = useState<IMessageZulip['content']>('');
  const { email, profile } = useSelector(selectUserData);
  const config = configUser(email, profile.parameters.passwordZulip);

  const handleGetStream = useCallback(async () => {
    const client = await zulipInit(config);
    const readParams = {
      anchor: 'newest',
      num_before: 5,
      num_after: 0,
      narrow: [
        { operator: 'sender', operand: config.username },
        { operator: 'stream', operand: 'general' },
      ],
    };
    const { messages } = await client.messages.retrieve(readParams);
    setMessages(messages);
  }, [config]);

  const handleSend = useCallback(async () => {
    const client = await zulipInit(config);
    if (messages) {
      const params = {
        to: messages[0].display_recipient,
        type: 'stream',
        topic: 'Castle',
        content: message,
      };
      await client.messages.send(params);
      setMessage('');
    }
  }, [messages]);

  useEffect(() => {
    handleGetStream();
  }, [handleSend]);

  const handleLogout = () => {
    dispatch(requestLogoutChatUser());
  };

  if (!messages.length) {
    return <p>Loading... </p>;
  }

  return (
    <SideBarTitle
      title={messages[0].display_recipient}
      actions={[{ icon: LogoutIcon, callback: handleLogout }]}
    >
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
    </SideBarTitle>
  );
};

export default Users;
