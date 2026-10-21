import { Box, Button, ToggleButton, Tooltip, styled } from '@mui/material';
import { useRouteMatch } from '@/compat/router';
import { NavLink, useParams } from 'react-router-dom';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import React from 'react';
import { useWireframe } from '@Src/hooks/useWireframe';
import { EditorModeIcon, WireframeModeIcon } from './../icons';

const AlignButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.grey[600],
  fontSize: 12,
  height: 36,
  fontWeight: 600,
  margin: '0 24px',

  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ActiveLink = React.forwardRef<
  any,
  { to: string; children: React.ReactNode }
>(({ to, children, ...props }, forwardRef) => {
  const match = useRouteMatch({
    path: '',
    exact: true,
  });

  return (
    <ToggleButton
      ref={forwardRef}
      value={to}
      selected={!!match}
      {...props}
      to={to}
      component={NavLink}
    >
      {children}
    </ToggleButton>
  );
});

const ModeToggleBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#F6F6F6',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '36px',
  overflow: 'hidden',

  '& 	.MuiButtonBase-root': {
    borderRadius: 0,
    border: 'none',
    color: '#B7B9BD',

    '&.active': {
      color: '#5064FF',
    },

    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
}));

const ToggleMode = () => {
  const { projectId, screenId } = useParams<{
    projectId: string;
    screenId?: string;
  }>();

  const wireframePath = `/wireframe/${projectId}${
    screenId ? `/${screenId}` : ''
  }`;

  const { isWireframeMode } = useWireframe();

  const handleAlign = () => {
    if (window.wireframeCanvas) {
      const canvas = window.wireframeCanvas as ReactZoomPanPinchRef;
      canvas.centerView();
    }
  };

  return (
    <>
      <ModeToggleBox>
        <Tooltip title="Editor Mode">
          <ActiveLink
            to={`/project/${projectId}${screenId ? `/${screenId}` : ''}`}
          >
            <EditorModeIcon />
          </ActiveLink>
        </Tooltip>
        <Tooltip title="Wireframe Mode">
          <ActiveLink to={wireframePath}>
            <WireframeModeIcon />
          </ActiveLink>
        </Tooltip>
      </ModeToggleBox>
      {isWireframeMode && (
        <AlignButton onClick={handleAlign} variant="contained" disableElevation>
          Auto align
        </AlignButton>
      )}
    </>
  );
};

export default ToggleMode;
