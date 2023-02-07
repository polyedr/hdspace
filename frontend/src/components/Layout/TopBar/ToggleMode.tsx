import { Box, Button, ToggleButton, styled } from '@mui/material';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
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

const ActiveLink = ({ to, children, ...props }) => {
  const match = useRouteMatch({
    path: '',
    exact: true,
  });

  return (
    <ToggleButton
      value={to}
      selected={!!match}
      {...props}
      to={to}
      component={NavLink}
    >
      {children}
    </ToggleButton>
  );
};

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
        <ActiveLink
          to={`/project/${projectId}${screenId ? `/${screenId}` : ''}`}
          aria-label="Editor Mode"
        >
          <EditorModeIcon />
        </ActiveLink>
        <ActiveLink to={wireframePath} aria-label="Wireframe Mode">
          <WireframeModeIcon />
        </ActiveLink>
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
