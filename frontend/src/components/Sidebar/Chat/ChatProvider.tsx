import { selectTokenPair, selectUserData } from '@Redux/user/selectors';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Chat, enTranslations, Streami18n } from 'stream-chat-react';
import client from './client';

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
  },
});

function ChatProvider({ children, user, token }) {
  useEffect(() => {
    const payload = {
      id: user.id.toString(),
      name: `${user.firstName} ${user.lastName}`,
      image: user.profile.avatar,
      username: user.username,
    };

    client.connectUser(payload, token);

    return () => {
      client.disconnectUser();
    };
  }, []);

  return (
    <Chat {...{ client, i18nInstance }} theme="team light">
      {children}
    </Chat>
  );
}

export default function ({ children }) {
  const token = useSelector(selectTokenPair);
  const user = useSelector(selectUserData);

  if (user?.username.trim() !== '' && token?.streamchat) {
    return (
      <ChatProvider user={user} token={token.streamchat}>
        {children}
      </ChatProvider>
    );
  }

  return children;
}
