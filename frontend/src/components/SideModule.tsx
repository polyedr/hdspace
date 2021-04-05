import React, { FC, useRef } from 'react';

const host = 'http://localhost:3000';

const SideModule: FC = () => {
  const ref = useRef<HTMLIFrameElement>(null);

  return (
    <div>
      <iframe
        onLoad={() => ref.current?.contentWindow?.postMessage('test', host)}
        ref={ref}
        src={host}
        frameBorder="0"
        title="sidebar"
      />
    </div>
  );
};

export default SideModule;
