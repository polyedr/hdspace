import { selectTokenPair } from '@Redux/user/selectors';
import React, { FC, useRef } from 'react';
import { useSelector } from 'react-redux';

const host = 'http://localhost:3000';

const SideModule: FC = () => {
  const { access } = useSelector(selectTokenPair);

  const ref = useRef<HTMLIFrameElement>(null);

  return (
    <div>
      <iframe
        onLoad={() =>
          // move to saga
          ref.current?.contentWindow?.postMessage(
            { type: 'setAccessToken', payload: access },
            host,
          )
        }
        ref={ref}
        src={host}
        frameBorder="0"
        title="sidebar"
      />
    </div>
  );
};

export default SideModule;
