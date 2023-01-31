import React from 'react';
import { Box, Button, ToggleButton, styled } from '@mui/material';
import { EditorModeIcon, WireframeModeIcon } from './../icons';
import { NavLink, useParams, useRouteMatch } from 'react-router-dom';

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
    <ToggleButton to={to} {...props} LinkComponent={NavLink} selected={match}>
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

  '& button': {
    borderRadius: 0,

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
  return (
    <>
      <ModeToggleBox>
        <ActiveLink
          to={`/project/${projectId}${screenId ? `/${screenId}` : ''}`}
          aria-label="Editor Mode"
        >
          <EditorModeIcon />
        </ActiveLink>
        <ActiveLink
          to={`/wireframe/${projectId}${screenId ? `/${screenId}` : ''}`}
          aria-label="Wireframe Mode"
        >
          <WireframeModeIcon />
        </ActiveLink>
      </ModeToggleBox>
      <AlignButton variant="contained" disableElevation>
        Auto align
      </AlignButton>
    </>
  );
};

export default ToggleMode;
