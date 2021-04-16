import { useEffect } from 'react';
import { sidebarLogoutSuccess } from '@Redux/project/actions';
import { useDispatch } from 'react-redux';
import { IFrameMessage } from '../../types';

const useMessageListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const listener = (ev: MessageEvent<IFrameMessage>) => {
      const { data } = ev;

      if (!data) return;

      switch (data.type) {
        case 'sidebarLogoutSuccess':
          dispatch(sidebarLogoutSuccess());
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
