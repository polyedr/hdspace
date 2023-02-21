import React from 'react';
import FrameWrapper from '@Components/Editor/FrameWrapper';

const Frame: React.FC = ({ children }) => {
  return <FrameWrapper>{children}</FrameWrapper>;
};

export default Frame;
