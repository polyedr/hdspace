import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useChatContext } from 'stream-chat-react';
import _debounce from 'lodash.debounce';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import { channelByUser, ChannelOrUserType, isChannel } from './utils';
import { ResultsDropdown } from './ResultsDropdown';
import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../client';
import type { Channel, UserResponse } from 'stream-chat';

import './ChannelSearch.css';

const SearchTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    '&:before': {
      borderColor: '#E4E6EB',
    },
  },
});

export function ChannelSearch() {
  const projectId = useSelector(selectCurrentProjectId);

  const { client, setActiveChannel } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType
  >();

  const [allChannels, setAllChannels] = useState<
    ConcatArray<ChannelOrUserType> | undefined
  >();
  const [teamChannels, setTeamChannels] = useState<
    | Array<
        Channel<
          TeamAttachmentType,
          TeamChannelType,
          TeamCommandType,
          TeamEventType,
          TeamMessageType,
          TeamReactionType
        >
      >
    | undefined
  >();
  const [directChannels, setDirectChannels] = useState<
    Array<UserResponse<TeamUserType>> | undefined
  >();

  const [focused, setFocused] = useState<number>();
  const [focusedId, setFocusedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === allChannels.length - 1 ? 0 : prevFocused + 1;
        });
      } else if (event.key === 'ArrowUp') {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === 0 ? allChannels.length - 1 : prevFocused - 1;
        });
      } else if (event.key === 'Enter') {
        event.preventDefault();

        if (allChannels !== undefined && focused !== undefined) {
          const channelToCheck = allChannels[focused];

          if (isChannel(channelToCheck)) {
            setActiveChannel(channelToCheck);
          } else {
            channelByUser({ client, setActiveChannel, user: channelToCheck });
          }
        }

        setFocused(undefined);
        setFocusedId('');
        setQuery('');
      }
    },
    [allChannels, client, focused, setActiveChannel], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (query) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, query]);

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  useEffect(() => {
    if (focused && focused >= 0 && allChannels) {
      setFocusedId(allChannels[focused].id || '');
    }
  }, [allChannels, focused]);

  const setChannel = (
    channel: Channel<
      TeamAttachmentType,
      TeamChannelType,
      TeamCommandType,
      TeamEventType,
      TeamMessageType,
      TeamReactionType
    >,
  ) => {
    setQuery('');
    setActiveChannel(channel);
  };

  const getChannels = async (text: string) => {
    try {
      const channelResponse = client.queryChannels(
        {
          type: 'team',
          name: { $autocomplete: text },
          team: projectId.toString(),
        },
        {},
        { limit: 5 },
      );

      const userResponse = client.queryUsers(
        {
          id: { $ne: client.userID || '' },
          $and: [
            {
              name: { $autocomplete: text },
              teams: { $contains: projectId.toString() },
            },
          ],
        },
        { id: 1 },
        { limit: 5 },
      );

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
      setAllChannels([...channels, ...users]);
    } catch (event) {
      setQuery('');
    }

    setLoading(false);
  };

  const getChannelsDebounce = _debounce(getChannels, 100, {
    trailing: true,
  });

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setLoading(true);
    setFocused(undefined);
    setQuery(event.target.value);
    if (!event.target.value) return;

    getChannelsDebounce(event.target.value);
  };

  return (
    <div className="channel-search__container">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <SearchTextField
          onChange={onSearch}
          placeholder="Search"
          type="text"
          value={query}
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          focusedId={focusedId}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
        />
      )}
    </div>
  );
}
