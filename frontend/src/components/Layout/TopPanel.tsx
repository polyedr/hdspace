import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentProject,
  selectSidebarOpen,
} from '@Redux/project/selectors/base';
import {
  deleteElement,
  updateNameAndTagsProject,
  setSidebarOpen,
  setVIAMode,
} from '@Redux/project/actions';
import {
  selectVIAModeEnabled,
  selectVIAResultId,
} from '@Redux/project/selectors/via';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Box } from '@material-ui/core';
import { StyledIconButton } from '@Components/styledComponents';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { selectUserData } from '@Redux/user/selectors';
import Dialog from '../Dialogs/Dialog';
import TopBar from './TopBar';
import Avatar from './Avatar';
import History from './History';
import RenameProjectBar from './TopBar/RenameProjectBar';
import Logo from '../UI/Logo';

const useStyles = makeStyles(({ typography, palette }) => ({
  toolbar: {
    backgroundColor: 'white',
    color: palette.common.white,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 75,
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
  },
  settingIcon: {
    color: '#81818E',
  },
}));

const TopPanel = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openEdit, setOpenEdit] = useState(false);
  const {
    name: projectName,
    id,
    user: { id: userIdCreator },
    tags,
  } = useSelector(selectCurrentProject);
  const { id: userId } = useSelector(selectUserData);
  const viaMode = useSelector(selectVIAModeEnabled);
  const sidebarOpen = useSelector(selectSidebarOpen);
  const viaResultId = useSelector(selectVIAResultId);
  const screenId = useSelector(selectCurrentScreenId);

  const handleEditClick = () => setOpenEdit(true);
  const handleClose = () => setOpenEdit(false);
  const handleSubmitNameAndTags = async (values) => {
    dispatch(updateNameAndTagsProject(id, values.name, values.tags));
    handleClose();
  };

  const tagsWithoutSpace = tags?.map((item, index) => {
    if (index === 0) return item;
    return ` ${item}`;
  });

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
        <Logo />

        {projectName && (
          <RenameProjectBar
            projectName={projectName}
            userIdCreator={userIdCreator}
            userId={userId}
            handleEditClick={handleEditClick}
          />
        )}
        <Box style={{ display: 'flex' }}>
          {viaMode ? <History /> : <TopBar />}

          {!viaMode && viaResultId && (
            <StyledIconButton
              title="Return to annotation"
              onClick={handleReturnToAnnotation}
            >
              <SettingsBackupRestoreIcon />
            </StyledIconButton>
          )}

          <Box style={{ display: 'flex' }}>
            {projectName && (
              <IconButton
                className={classes.sidebarButton}
                onClick={handleSidebarToggle}
                title="Toggle Sidebar"
              >
                <SettingsOutlinedIcon className={classes.settingIcon} />
              </IconButton>
            )}
            <Avatar />
          </Box>
        </Box>
      </Toolbar>

      <Dialog
        open={openEdit}
        onSubmit={handleSubmitNameAndTags}
        onClose={handleClose}
        title="Rename or add tags for the project"
        fieldName="name"
        initialValueName={projectName}
        initialValueTags={tagsWithoutSpace}
        description={`Enter new name for project ${projectName}`}
      />
    </AppBar>
  );
};

export default TopPanel;
