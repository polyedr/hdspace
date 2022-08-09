import React, { useEffect, useState } from 'react';

import { ChannelFilters, ChannelSort } from 'stream-chat';

// import 'stream-chat-react/dist/css/index.css';
import './App.css';

import { useChecklist } from './ChecklistTasks';
import client, { TeamChannelType } from './client';
import { ChannelContainer } from './components/ChannelContainer/ChannelContainer';
import { ChannelListContainer } from './components/ChannelListContainer/ChannelListContainer';

const targetOrigin = 'localhost:8080';

const filters: ChannelFilters[] = [
  { type: 'team', demo: 'team' },
  { type: 'messaging', demo: 'team' },
];
const options = { state: true, watch: true, presence: true, limit: 3 };
const sort: ChannelSort<TeamChannelType> = {
  last_message_at: -1,
  updated_at: -1,
};

// client.connectUser({ id: user!, name: user, image: '' }, userToken);

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useChecklist({ chatClient: client, targetOrigin: targetOrigin! });

  useEffect(() => {
    const handleColorChange = (color: string) => {
      const root = document.documentElement;
      if (color.length && color.length === 7) {
        root.style.setProperty('--primary-color', `${color}E6`);
        root.style.setProperty('--primary-color-alpha', `${color}1A`);
      }
    };

    window.addEventListener('message', (event) =>
      handleColorChange(event.data),
    );
    return () => {
      client.disconnectUser();
      window.removeEventListener('message', (event) =>
        handleColorChange(event.data),
      );
    };
  }, []);

  return (
    <>
      <div className="app__wrapper">
        <ChannelListContainer
          {...{
            isCreating,
            filters,
            options,
            setCreateType,
            setIsCreating,
            setIsEditing,
            sort,
          }}
        />
        <ChannelContainer
          {...{
            createType,
            isCreating,
            isEditing,
            setIsCreating,
            setIsEditing,
          }}
        />
      </div>
    </>
  );
};

export default App;
