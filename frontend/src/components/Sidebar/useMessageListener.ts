import { useEffect } from 'react';
import { sidebarLogoutSuccess } from '@Redux/project/actions';
import { useDispatch } from 'react-redux';
import { chatLogout, setChatCredentials } from '@Redux/user/actions';
import { IframeMessage, MessageType } from './messageType';

const useMessageListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const listener = (ev: MessageEvent<IframeMessage>) => {
      const { data } = ev;

      if (!data) return;

      switch (data.type) {
        case MessageType.sidebarLogoutSuccess:
          dispatch(sidebarLogoutSuccess());
          break;

        case MessageType.setChatCredentials:
          dispatch(setChatCredentials(data.payload));
          break;

        case MessageType.chatLogout:
          dispatch(chatLogout());
          break;

        default:
          break;
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [dispatch]);
};
export default useMessageListener;
