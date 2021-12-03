import React, { useCallback, useEffect, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import * as actions from '@Redux/pmtools/chat/actions';
import { useDispatch, useSelector } from 'react-redux';
import { PanelTextField, SideBarTitle } from '@Components/styledComponents';
import { Button } from '@material-ui/core';
import { IMessageZulip } from '@Src/types/pmtools/types';
import { selectMessagesZulip } from '@Redux/pmtools/chat/selectors';
import Message from './Message';

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessagesZulip);
  const [text, setText] = useState('');

  const handleSend = useCallback(async () => {
    dispatch(actions.requestSendStreamMessage({ message: text }));
  }, [dispatch, text, messages]);

  useEffect(() => {
    dispatch(actions.requestProjectStreamMessages());
  }, [dispatch, handleSend]);

  if (!messages) {
    return <p>Loading... </p>;
  }

  return (
    <SideBarTitle
      title="Chat"
      actions={[
        {
          icon: LogoutIcon,
          callback: () => dispatch(actions.requestLogoutChatUser()),
        },
      ]}
    >
      {!messages.length ? (
        <p>Not found</p>
      ) : (
        messages.map((m: IMessageZulip) => <Message key={m.id} message={m} />)
      )}

      <div style={{ position: 'fixed', bottom: 10 }}>
        <PanelTextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter message"
        />
        <Button variant="contained" color="secondary" onClick={handleSend}>
          Send
        </Button>
      </div>
    </SideBarTitle>
  );
};

export default Messages;
