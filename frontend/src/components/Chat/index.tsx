import React, { useEffect, useState } from 'react';

import {
  LiteralStringForUnion,
  StreamChat,
  ChannelFilters,
  ChannelSort,
} from 'stream-chat';
import { Chat, enTranslations, Streami18n } from 'stream-chat-react';

// import 'stream-chat-react/dist/css/index.css';
import './App.css';

import { useChecklist } from './ChecklistTasks';
import { ChannelContainer } from './components/ChannelContainer/ChannelContainer';
import { ChannelListContainer } from './components/ChannelListContainer/ChannelListContainer';

const apiKey = 'jfcd9hhxbwq8';
const user = 'john';
const theme = 'light';
const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiam9obiJ9.QDF63FopS8e1nLmU8nfXw_w35G_Xs6Jx5YMZhJoCyXc';
const targetOrigin = 'localhost:8080';

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
  },
});

export type TeamAttachmentType = Record<string, unknown>;
export type TeamChannelType = Record<string, unknown>;
export type TeamCommandType = LiteralStringForUnion;
export type TeamEventType = Record<string, unknown>;
export type TeamMessageType = Record<string, unknown>;
export type TeamReactionType = Record<string, unknown>;
export type TeamUserType = { image?: string };

const filters: ChannelFilters[] = [
  { type: 'team', demo: 'team' },
  { type: 'messaging', demo: 'team' },
];
const options = { state: true, watch: true, presence: true, limit: 3 };
const sort: ChannelSort<TeamChannelType> = {
  last_message_at: -1,
  updated_at: -1,
};

const client = StreamChat.getInstance<
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType
>(apiKey!, { enableInsights: true, enableWSFallback: true });
client.connectUser({ id: user!, name: user, image: '' }, userToken);

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
        <Chat {...{ client, i18nInstance }} theme={`team ${theme}`}>
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
        </Chat>
      </div>
    </>
  );
};

export default App;
