/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-return */
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
import { selectBoardData } from '@Redux/pmtools/board/selectors';
import Message from './Message';

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<IStream>([]);
  const [message, setMessage] = useState<IMessageZulip['content']>('');
  const { name: boardName } = useSelector(selectBoardData);

  const { email, profile } = useSelector(selectUserData);
  const config = configUser(email, profile.parameters.passwordZulip);

  const handleSend = useCallback(async () => {
    const client = await zulipInit(config);
    if (messages || boardName) {
      const params = {
        to: boardName,
        type: 'stream',
        topic: 'Castle',
        content: message,
      };
      await client.messages.send(params);
      setMessage('');
    }
  }, [messages, boardName]);

  useEffect(() => {
    let cleanupFunction = false;
    const handleGetStream = async () => {
      if (boardName) {
        const client = await zulipInit(config);
        const readParams = {
          anchor: 'newest',
          num_before: 1000,
          num_after: 0,
          narrow: [{ operator: 'stream', operand: boardName }],
        };
        const { messages } = await client.messages.retrieve(readParams);
        if (!cleanupFunction) setMessages(messages);
      }
    };
    handleGetStream();

    return () => {
      cleanupFunction = true;
      return;
    };
  }, [handleSend, boardName]);

  const handleLogout = () => {
    dispatch(requestLogoutChatUser());
  };

  if (!messages) {
    return <p>Loading... </p>;
  }

  return (
    <SideBarTitle
      title="Chat"
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

export default Messages;
