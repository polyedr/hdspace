/* eslint-disable import/no-cycle */
import React, { useCallback, useEffect, useState } from 'react';
import * as actions from '@Redux/pmtools/chat/actions';
import { useDispatch, useSelector } from 'react-redux';
import { PanelTextField } from '@Components/styledComponents';
import { Button } from '@material-ui/core';
import { selectMessagesZulip } from '@Redux/pmtools/chat/selectors';
import { IMessageZulip } from '@Src/types/pmtools/types';
import Messages from './Messages';
import Message from './Message';

const Support: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessagesZulip);
  const [message, setMessage] = useState('');
  const [supportChat, setSupportChat] = useState(false);

  const handleSend = useCallback(async () => {
    dispatch(actions.requestSendStreamMessage({ stream: 'general', message }));
    setMessage('');
  }, [dispatch, message]);

  useEffect(() => {
    dispatch(actions.requestProjectStreamMessages({ stream: 'general' }));
  }, [dispatch, handleSend]);

  if (supportChat) {
    return <Messages />;
  }

  if (!messages) {
    return <p>Loading... </p>;
  }

  return (
    <div style={{ height: 500, overflowY: 'auto' }}>
      {!messages.length ? (
        <p>Not found</p>
      ) : (
        messages.map((m: IMessageZulip) => <Message key={m.id} message={m} />)
      )}
      <div style={{ position: 'fixed', bottom: 10 }}>
        <PanelTextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <Button variant="contained" color="secondary" onClick={handleSend}>
          Send
        </Button>
        <Button
          onClick={() => setSupportChat(!supportChat)}
          style={{ margin: 10 }}
          variant="contained"
          color="primary"
        >
          Support
        </Button>
      </div>
    </div>
  );
};

export default Support;
