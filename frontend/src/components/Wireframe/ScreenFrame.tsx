import React from 'react';
import { Box, styled } from '@mui/material';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './constants';

const MuiBox = styled(Box)<{ active: boolean }>(({ active, theme }) => ({
  width: SCREEN_WIDTH,
  minHeight: SCREEN_HEIGHT,
  overflow: 'auto',
  backgroundColor: 'white',
  boxShadow: `0 0 ${active ? 10 : 6}px 0 rgba(0, 0, 0, 0.08)`,
  border: `4px solid ${active ? 'black' : 'white'}`,
  cursor: 'auto',
}));

const ScreenFrame: React.FC<{ active: boolean }> = ({ children, active }) => {
  return (
    <MuiBox active={active} className="wireframe-screen-frame">
      {children}
    </MuiBox>
  );
};

export default ScreenFrame;
