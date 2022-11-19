import React from 'react';

import './TeamChannelList.css';

import type { ChannelListMessengerProps } from 'stream-chat-react';
import { useSelector } from 'react-redux';
import { selectCurrentProject } from '@Redux/project/selectors/base';
import { selectUserData } from '@Redux/user/selectors';
import Scrollbar from '@Components/UI/Scrollbar';
import { AddChannel } from '../../assets';

export type TeamChannelListProps = ChannelListMessengerProps & {
  setCreateType: React.Dispatch<React.SetStateAction<string>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
};

const ChannelList: React.FC<TeamChannelListProps> = (props) => {
  const {
    children,
    error = false,
    loading,
    setCreateType,
    setIsCreating,
    setIsEditing,
    type,
  } = props;

  const project = useSelector(selectCurrentProject);
  const user = useSelector(selectUserData);

  if (error) {
    return type === 'team' ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === 'team' ? 'Channels' : 'Messages'} loading....
        </p>
      </div>
    );
  }

  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === 'team' ? 'Channels' : 'Direct Messages'}
        </p>
        {project.user.id === user.id ? (
          <AddChannel
            {...{ setCreateType, setIsCreating, setIsEditing }}
            type={type === 'team' ? 'team' : 'messaging'}
          />
        ) : null}
      </div>
      {/* <div className="channel-list-wrapper">{children}</div> */}
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '250px',

          // '&::-webkit-scrollbar': {
          //   width: '4px !important',
          // },
        }}
      >
        {children}
      </Scrollbar>
    </div>
  );
};

export const TeamChannelList = React.memo(ChannelList);
