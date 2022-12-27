import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import './CreateChannel.css';

import type { ChannelFilters } from 'stream-chat';
import logger from 'loglevel';
import Stack from '@mui/material/Stack';
import { Button, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import UserPermissionsModal from '@Components/Dialogs/UserPermissionsModal';
import { UserList } from './UserList';

import { CloseCreateChannel } from '../../assets';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../client';

interface InputProps {
  channelName: string;
  setChannelName: (value: React.SetStateAction<string>) => void;
}

const InputWrapper = styled(FormControl)({
  position: 'relative',

  '& svg': {
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    color: '#81818E',
    fontSize: 24,
  },

  '& input': {
    paddingLeft: '40px',
    width: '230px',
  },
});

const StyledInput = styled(TextField)({
  '& input': {
    width: '257px',
  },

  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E4E6EB',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
  },

  '& label.Mui-focused': {
    color: '#81818E',
  },

  '& .MuiInputBase-root.Mui-focused fieldset': {
    borderColor: '#E4E6EB',
  },

  '& .MuiInputLabel-root': {
    color: '#81818E',
  },
});

const InviteButton = styled(Button)({});

const NameInputWrapper = styled('div')({
  padding: '20px 0 0 20px',

  '& p': {
    marginBottom: 0,
    fontWeight: 500,
  },
});

const ChannelNameInput: React.FC<InputProps> = (props) => {
  const { channelName = '', setChannelName } = props;
  const handleChange = (event: {
    preventDefault: () => void;
    target: { value: string };
  }) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <NameInputWrapper className="channel-name-input__wrapper1">
      {/* <p>Name</p> */}
      {/* <input
        onChange={handleChange}
        placeholder="Channel-name (no spaces)"
        type="text"
        value={channelName}
      /> */}
      <StyledInput
        size="small"
        onChange={handleChange}
        placeholder="Channel-name (no spaces)"
        type="text"
        value={channelName}
        label="Name"
      />
      <p>Add Members</p>
    </NameInputWrapper>
  );
};

interface Props {
  createType: string;
  filters: ChannelFilters[];
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateChannel: React.FC<Props> = (props) => {
  const { createType, filters, setIsCreating } = props;

  const [inviteProjectId, setInviteProjectId] = useState<number | null>(null);

  const { client, setActiveChannel } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const projectId = useSelector(selectCurrentProjectId);

  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([
    client.userID || '',
  ]);

  const createChannel = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!selectedUsers?.length) return;

    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
        team: projectId.toString(),
      });

      await newChannel.watch();

      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID || '']);
      setActiveChannel(newChannel);
    } catch (err) {
      logger.error(err);
    }
  };

  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        {/* <p>
          {createType === 'team' ? 'Create a New Channel' : 'New Conversation'}
        </p> */}
        <p>{createType === 'team' ? 'New Channel' : 'New Conversation'}</p>
        <CloseCreateChannel {...{ setIsCreating }} />
      </div>
      {createType === 'team' && (
        <ChannelNameInput {...{ channelName, setChannelName }} />
      )}
      <div>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          mx={2.5}
          mt={2}
          mb={1}
        >
          <InputWrapper>
            <StyledInput placeholder="Search User" type="text" size="small" />
            <SearchIcon />
          </InputWrapper>
          <div>
            <InviteButton
              onClick={() => setInviteProjectId(projectId)}
              variant="contained"
              color="primary"
            >
              Invite People
            </InviteButton>
          </div>
        </Stack>
      </div>
      <UserList {...{ filters, setSelectedUsers, selectedUsers }} />
      <div className="button-wrapper">
        <Button
          variant="contained"
          disabled={!selectedUsers || selectedUsers?.length < 2}
          onClick={createChannel}
        >
          {createType === 'team' ? 'Create Channel' : 'Start Conversation'}
        </Button>
      </div>
      <UserPermissionsModal
        projectId={inviteProjectId}
        onClose={() => setInviteProjectId(null)}
      />
    </div>
  );
};
