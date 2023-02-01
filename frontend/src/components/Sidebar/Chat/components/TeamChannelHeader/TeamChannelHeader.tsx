// @ts-nocheck
import React from 'react';
import {
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../client';

import Avatar from '@Components/UI/Avatar';

import './TeamChannelHeader.css';

import { ChannelInfo, PinIcon } from '../../assets';

interface Props {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setPinsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TeamChannelHeader: React.FC<Props> = (props) => {
  const { setIsEditing, setPinsOpen } = props;

  const { client } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const { channel, watchers } = useChannelStateContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const { closeThread } = useChannelActionContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const teamHeader = `# ${
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
    (channel?.data?.name ?? channel?.data?.id) || 'random'
  }`;

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );
    const additionalMembers = members.length - 3;

    if (!members.length) {
      return null;
    }

    return (
      <div className="team-channel-header__name-wrapper">
        {members.map(({ user }, i) => {
          if (i > 2) return null;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="team-channel-header__name-multi">
              <Avatar src={user?.image} alt={user?.name || user?.id || ''} />
              {/* <p className="team-channel-header__name user">
                {user?.name || user?.id || null}
              </p> */}
            </div>
          );
        })}
        {additionalMembers > 0 && (
          <p className="team-channel-header__name user">{`and ${additionalMembers} more`}</p>
        )}
      </div>
    );
  };

  const getPinnedMessageText = (count: number) => {
    if (count === 1) {
      return '(1) message pinned';
    }

    return `(${count}) messages pinned`;
  };

  return (
    <div className="team-channel-header__container">
      {channel.type === 'messaging' ? (
        getMessagingHeader()
      ) : (
        <div className="team-channel-header__channel-wrapper">
          <p className="team-channel-header__name">{teamHeader}</p>
          {/* <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
            <ChannelInfo />
          </span> */}
        </div>
      )}
      <div className="team-channel-header__right">
        {watchers
          ? Object.values(watchers).map((watcher) => (
              <Avatar
                key={watcher.id}
                src={watcher?.image ?? undefined}
                alt={watcher.name ?? ''}
              />
            ))
          : null}

        {channel.state.pinnedMessages.length > 0 ? (
          <div
            className="team-channel-header__right-pin-wrapper"
            onClick={(event) => {
              if (closeThread) closeThread(event);
              setPinsOpen((prevState) => !prevState);
            }}
          >
            <PinIcon />
            <p className="team-channel-header__right-text">
              {getPinnedMessageText(channel.state.pinnedMessages.length)}
            </p>
          </div>
        ) : null}

        <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
          <ChannelInfo />
        </span>
      </div>
    </div>
  );
};
