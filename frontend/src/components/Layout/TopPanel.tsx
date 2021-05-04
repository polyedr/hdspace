import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import {
  selectCurrentProject,
  selectSidebarOpen,
} from '@Redux/project/selectors/base';
import {
  deleteElement,
  renameProject,
  setSidebarOpen,
  setVIAMode,
} from '@Redux/project/actions';
import {
  selectVIAModeEnabled,
  selectVIAResultId,
} from '@Redux/project/selectors/via';
import DehazeIcon from '@material-ui/icons/Dehaze';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import { StyledIconButton } from '@Components/styledComponents';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import Dialog from '../Dialogs/Dialog';
import TopBar from './TopBar';
import Avatar from './Avatar';
import History from './History';

const useStyles = makeStyles(({ typography, palette }) => ({
  toolbar: {
    backgroundColor: palette.panel.main,
    color: palette.common.white,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    padding: '0.5em 1em',
    '&:hover $editButton': {
      opacity: 1,
    },
    display: 'flex',
    alignItems: 'center',
  },
  editButton: {
    color: palette.common.white,
    opacity: 0,
    transition: 'opacity 0.1s ease',
  },
  projectName: {
    fontSize: '1rem',
    fontFamily: typography.fontFamily,
    fontWeight: 'bold',
  },
  sidebarButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
  },
}));

const TopPanel = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);

  const { name: projectName, id } = useSelector(selectCurrentProject);
  const viaMode = useSelector(selectVIAModeEnabled);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const viaResultId = useSelector(selectVIAResultId);
  const screenId = useSelector(selectCurrentScreenId);

  const handleEditClick = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);
  const handleSubmitRename = async (values) => {
    dispatch(renameProject(id, values.name));
    handleClose();
  };

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  const handleReturnToAnnotation = () => {
    dispatch(setVIAMode(true));
    dispatch(deleteElement(viaResultId, { screenId }));
  };

  return (
    <AppBar position="fixed">
      <Toolbar variant="dense" className={classes.toolbar}>
        <Avatar />

        {projectName && (
          <div className={classes.title}>
            <Typography variant="h6" className={classes.projectName}>
              {projectName}
            </Typography>

            <IconButton
              onClick={handleEditClick}
              className={classes.editButton}
              size="small"
              title="Rename project"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        {viaMode ? <History /> : <TopBar />}

        {!viaMode && viaResultId && (
          <StyledIconButton
            title="Return to annotation"
            onClick={handleReturnToAnnotation}
          >
            <SettingsBackupRestoreIcon />
          </StyledIconButton>
        )}

        {projectName && (
          <IconButton
            className={classes.sidebarButton}
            onClick={handleSidebarToggle}
            title="Toggle Sidebar"
          >
            <DehazeIcon />
          </IconButton>
        )}
      </Toolbar>

      <Dialog
        open={openEdit}
        onSubmit={handleSubmitRename}
        onClose={handleClose}
        title="Rename Project"
        fieldName="name"
        initialValue={projectName}
        description={`Enter new name for project ${projectName}`}
      />
    </AppBar>
  );
};

export default TopPanel;
