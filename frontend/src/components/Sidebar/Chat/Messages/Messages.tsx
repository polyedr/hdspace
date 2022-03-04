import React, { useCallback, useEffect, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import * as actions from '@Redux/pmtools/chat/actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  PanelTextField,
  StyledAccordionSummary,
  StyledIconButton,
} from '@Components/styledComponents';
import { Button } from '@material-ui/core';
import { IMessageZulip } from '@Src/types/pmtools/types';
import { selectBoardData } from '@Redux/pmtools/board/selectors';
import { selectMessagesZulip } from '@Redux/pmtools/chat/selectors';
import Message from './Message';

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoardData);
  const [message, setMessage] = useState('');
  const messages: Array<IMessageZulip> = useSelector(selectMessagesZulip);

  const handleSend = useCallback(async () => {
    if (board) {
      dispatch(
        actions.requestSendStreamMessage({ stream: board.name, message }),
      );
      setMessage('');
    }
  }, [board, dispatch, message]);

  useEffect(() => {
    if (board) {
      dispatch(actions.requestProjectStreamMessages({ stream: board.name }));
    }
  }, [board, dispatch]);

  if (!messages) {
    return <p>Loading... </p>;
  }

  return (
    <div style={{ overflowY: 'auto' }}>
      <StyledAccordionSummary
        expandIcon={
          <StyledIconButton
            size="small"
            title="Chat"
            onClick={() => dispatch(actions.requestLogoutChatUser())}
          >
            <LogoutIcon fontSize="small" />
          </StyledIconButton>
        }
      >
        {board?.name || 'Chat'}
      </StyledAccordionSummary>

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
        <Button
          variant="contained"
          color="secondary"
          disabled={!message}
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Messages;
