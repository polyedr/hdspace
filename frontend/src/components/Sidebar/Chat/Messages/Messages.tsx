/* eslint-disable import/no-cycle */
import React, { useCallback, useEffect, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import * as actions from '@Redux/pmtools/chat/actions';
import { useDispatch, useSelector } from 'react-redux';
import { PanelTextField, SideBarTitle } from '@Components/styledComponents';
import { Button } from '@material-ui/core';
import { IMessageZulip } from '@Src/types/pmtools/types';
import { selectMessagesZulip } from '@Redux/pmtools/chat/selectors';
import { selectBoardData } from '@Redux/pmtools/board/selectors';
import Message from './Message';
import Support from './Support';

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoardData);
  const messages = useSelector(selectMessagesZulip);
  const [message, setMessage] = useState('');
  const [supportChat, setSupportChat] = useState(false);

  const handleSend = useCallback(async () => {
    if (board) {
      dispatch(
        actions.requestSendStreamMessage({ stream: board.name, message }),
      );
      setMessage('');
    }
  }, [dispatch, message]);

  useEffect(() => {
    if (board) {
      dispatch(actions.requestProjectStreamMessages({ stream: board.name }));
    }
  }, [board, dispatch, handleSend]);

  if (supportChat) {
    return <Support />;
  }

  if (!messages) {
    return <p>Loading... </p>;
  }

  return (
    <div style={{ height: 500, overflowY: 'auto' }}>
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
      </SideBarTitle>
    </div>
  );
};

export default Messages;
