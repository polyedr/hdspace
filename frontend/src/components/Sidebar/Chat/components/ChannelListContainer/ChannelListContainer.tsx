import React from 'react';
import { ChannelList, ChannelListProps } from 'stream-chat-react';

import './ChannelListContainer.css';

import type { Channel, ChannelFilters } from 'stream-chat';
import { ChannelSearch } from '../ChannelSearch/ChannelSearch';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { TeamChannelPreview } from '../TeamChannelPreview/TeamChannelPreview';

type Props = Omit<ChannelListProps, 'filters'> & {
  setCreateType: React.Dispatch<React.SetStateAction<string>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  filters: ChannelFilters[];
};

const customChannelTeamFilter = (channels: Channel[]) => {
  return channels.filter((channel) => channel.type === 'team');
};

const customChannelMessagingFilter = (channels: Channel[]) => {
  return channels.filter((channel) => channel.type === 'messaging');
};

export const ChannelListContainer: React.FC<Props> = (props) => {
  const { filters, options, setCreateType, setIsCreating, setIsEditing, sort } =
    props;

  return (
    <div className="channel-list__container">
      <div className="channel-list__list__wrapper">
        <ChannelSearch />
        <ChannelList
          channelRenderFilterFn={customChannelTeamFilter}
          filters={filters[0]}
          options={options}
          sort={sort}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              {...{ setCreateType, setIsCreating, setIsEditing }}
              type="team"
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              {...{ setIsCreating, setIsEditing }}
              type="team"
            />
          )}
        />
        <ChannelList
          channelRenderFilterFn={customChannelMessagingFilter}
          filters={filters[1]}
          options={options}
          setActiveChannelOnMount={false}
          sort={sort}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              {...{ setCreateType, setIsCreating, setIsEditing }}
              type="messaging"
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              {...{ setIsCreating, setIsEditing }}
              type="messaging"
            />
          )}
        />
      </div>
    </div>
  );
};
