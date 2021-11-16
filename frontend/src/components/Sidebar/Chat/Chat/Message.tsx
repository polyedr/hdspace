import { Avatar, ListItemText, Typography } from '@material-ui/core';
import { IMessageZulip } from '@Src/types/pmtools/zulipTypes';
import React from 'react';

const Message: React.FC<{
  message: IMessageZulip;
  side: 'right' | 'left';
}> = ({ message, side }) => {
  if (!message) {
    return <p>Messages not found</p>;
  }
  return (
    <div style={{ textAlign: side, padding: 0, margin: 0 }}>
      <Avatar
        style={{ float: side, margin: '0 5px' }}
        src={message.avatar_url}
      />
      <ListItemText
        primary={message.sender_full_name}
        secondary={
          <Typography
            style={{ color: '#fff', width: 40, wordWrap: 'break-word' }}
            component="span"
            variant="body2"
          >
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
          </Typography>
        }
      />
    </div>
  );
};

export default Message;
