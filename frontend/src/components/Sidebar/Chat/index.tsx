import { selectCurrentProjectId } from '@Redux/project/selectors/base';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ChannelFilters, ChannelSort } from 'stream-chat';

// import 'stream-chat-react/dist/css/index.css';
import './App.css';

import { useChecklist } from './ChecklistTasks';
import client, { TeamChannelType } from './client';
import { ChannelContainer } from './components/ChannelContainer/ChannelContainer';
import { ChannelListContainer } from './components/ChannelListContainer/ChannelListContainer';

const targetOrigin = document.location.origin;

const options = { state: true, watch: true, presence: true };
const sort: ChannelSort<TeamChannelType> = {
  last_message_at: -1,
  updated_at: -1,
};

const App = () => {
  const projectId = useSelector(selectCurrentProjectId);

  const filters: ChannelFilters[] = [
    { type: 'team', team: { $in: [projectId.toString()] } },
    { type: 'messaging', team: { $in: [projectId.toString()] } },
  ];

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
