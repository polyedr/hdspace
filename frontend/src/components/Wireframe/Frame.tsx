import React from 'react';
import FrameComponent from 'react-frame-component';

const Frame: React.FC = ({ children }) => {
  return <FrameComponent>{children}</FrameComponent>;
};

export default Frame;
