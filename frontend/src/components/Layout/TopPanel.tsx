import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import EditIcon from '@material-ui/icons/Edit';
import {
  selectCurrentProject,
  selectSidebarOpen,
} from '@Redux/project/selectors/base';
import { renameProject, setSidebarOpen } from '@Redux/project/actions';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import DehazeIcon from '@material-ui/icons/Dehaze';
import { lighten } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import Dialog from '../Dialogs/Dialog';
import TopBar from './TopBar';
import Avatar from './Avatar';

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

  const handleEditClick = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);
  const handleSubmitRename = async (values) => {
    dispatch(renameProject(id, values.name));
    handleClose();
  };

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
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

        {viaMode ? 'Annotation mode' : <TopBar />}

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
