import React from 'react';
import { SCREEN_WIDTH } from './constants';

const ScreenFrame: React.FC = ({ children }) => {
  return (
    <div
      className="wireframe-screen-frame"
      style={{ width: SCREEN_WIDTH, overflow: 'scroll' }}
    >
      {children}
    </div>
  );
};

export default ScreenFrame;
