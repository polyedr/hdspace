import React from 'react';
import {
  useChannelActionContext,
  useChannelStateContext,
  Message,
} from 'stream-chat-react';

import './PinnedMessageList.css';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
} from '../../client';

import { CloseThreadIcon } from '../../assets';

interface Props {
  setPinsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PinnedMessageList: React.FC<Props> = (props) => {
  const { setPinsOpen } = props;

  const { closeThread } = useChannelActionContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType
  >();

  const { channel } = useChannelStateContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType
  >();

  return (
    <div className="pinned-messages__container">
      <div className="pinned-messages__header">
        <p className="pinned-messages__header-text">Pins</p>
        <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
      </div>
      <div className="pinned-messages__list">
        {channel.state.pinnedMessages.map((message) => (
          <Message
            groupStyles={['single']}
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </div>
  );
};
