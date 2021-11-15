import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
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
    <ListItem style={{ textAlign: side, padding: 0, margin: 0 }}>
      <ListItemAvatar>
        <Avatar src={message.avatar_url} />
      </ListItemAvatar>
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
    </ListItem>
  );
};

export default Message;
