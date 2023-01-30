import React from 'react';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';
import { Box } from '@mui/material';
import { styled } from '@mui/styles';

const MuiBox = styled(Box)({
  width: SCREEN_WIDTH,
  minHeight: SCREEN_HEIGHT,
  overflow: 'auto',
  backgroundColor: 'white',
  boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.08)',
  cursor: 'auto',
});

const ScreenFrame: React.FC = ({ children }) => {
  return (
    <MuiBox className="wireframe-screen-frame">
      {children}
    </MuiBox>
  );
};

export default ScreenFrame;
