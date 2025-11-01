import React from 'react';
import { Box, SxProps } from '@mui/material';
import {
  PANEL_TRANSITION_DURATION,
  RIGHT_PANEL_WIDTH,
} from '@Src/styles/Theme';
import ELEMENT_IDS from '@Constants/elementIds';

const styles: SxProps = {
  width: (props: any) => (props.open ? RIGHT_PANEL_WIDTH : 0),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: `width ${PANEL_TRANSITION_DURATION}ms ease`,
  backgroundColor: 'palette.panel.main',
  color: (theme) => 'theme.palette.common.white',
  overflow: 'hidden',
};

const EditorPanel: React.FC = ({ children }) => {
  return (
    <Box sx={styles} id={ELEMENT_IDS.rightPanel}>
      {children}
    </Box>
  );
};

export default EditorPanel;
