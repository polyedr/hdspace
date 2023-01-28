import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsPrototypeMode, selectUserData } from '@Redux/user/selectors';
import {
  selectCurrentProject,
  selectBordersEnabled,
  selectShowingBorders,
  selectShowingGrid,
} from '@Redux/project/selectors/base';
import {
  updateNameAndTagsProject,
  toggleContainersBorders,
  toggleGrid,
} from '@Redux/project/actions';
import {
  selectVIAModeEnabled,
  selectVIAResultId,
} from '@Redux/project/selectors/via';

import {
  styled,
  AppBar as MUIAppbar,
  Toolbar,
  IconButton,
  Box,
  Theme,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';

import { makeStyles } from '@mui/styles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { StyledIconButton } from '@Components/styledComponents';
import { HELP_LINK } from '@Src/config/settings';
import Dialog from '../Dialogs/Dialog';
import Layouts from './TopBar/Layouts';
import RenameProjectBar from './TopBar/RenameProjectBar';
import TopBar from './TopBar';
import History from './History';
import Logo from '../UI/Logo';
import Avatar from './Avatar';
import { ShowGridIcon, ShowBlockIcon } from './icons';

const Appbar = styled(MUIAppbar)({
  '&.MuiAppBar-root': {
    boxShadow: 'none',
    borderBottom: '1px solid #E4E6EB',

    '& .MuiToolbar-root': {
      padding: 0,
    },

    '& .MuiLink-root': {
      width: '73px',
      height: 55,
      borderRight: '1px solid #E4E6EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
});

const useStyles = makeStyles<Theme>(({ typography, palette }) => ({
  toolbar: {
    backgroundColor: 'white',
    color: palette.common.white,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
    gap: '8px',
  },
  topbarsections: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#81818E',
    fontSize: 14,
    '&:hover .editButton': {
      opacity: 1,
    },
    display: 'flex',
    alignItems: 'center',
  },

  projectName: {
    fontSize: '1rem',
    fontFamily: typography.fontFamily,
    fontWeight: 'bold',
  },
  togglebutton: {
    width: '32px',
    height: '32px',
    border: 'none !important',
    borderRadius: '50% !important',
    color: '#81818E !important',
    '&.Mui-selected': {
      color: '#000  !important',
    },
  },
  iconbutton: {
    width: '32px',
    height: '32px',
    color: '#81818E',
  },
  icon: {
    width: '20px !important',
  },
}));

function TopPanel() {
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
  const viaResultId = useSelector(selectVIAResultId);
  const bordersEnabled = useSelector(selectBordersEnabled);
  const handleEditClick = () => setOpenEdit(true);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const showBorders = useSelector(selectShowingBorders);

  const showGrid = useSelector(selectShowingGrid);

  const handleClose = () => setOpenEdit(false);
  const handleSubmitNameAndTags = async (values: {
    name: string;
    tags: string;
  }) => {
    dispatch(updateNameAndTagsProject(id, values.name, values.tags));
    handleClose();
  };

  const tagsWithoutSpace = tags?.map((item, index) => {
    if (index === 0) return item;
    return ` ${item}`;
  });

  return (
    <Appbar position="fixed">
      <Toolbar variant="dense" className={classes.toolbar}>
        <Box className={classes.topbarsections}>
          <Logo className={classes.icon} />
          {projectName && (
            <RenameProjectBar
              projectName={projectName}
              userIdCreator={userIdCreator}
              userId={userId}
              handleEditClick={handleEditClick}
            />
          )}
        </Box>
        <Box className={classes.topbarsections}>
          <Layouts />
        </Box>

        <Box className={classes.toolbar}>
          {viaMode ? <History /> : <TopBar />}

          {!viaMode && viaResultId && (
            <StyledIconButton title="Return to annotation">
              <SettingsBackupRestoreIcon className={classes.icon} />
            </StyledIconButton>
          )}

          <Box className={classes.toolbar}>
            {projectName && (
              <>
                <Box>
                  <ToggleButton
                    selected={showBorders}
                    value="borders"
                    className={classes.togglebutton}
                    disabled={!bordersEnabled && !isProtoMode}
                    onClick={() =>
                      dispatch(toggleContainersBorders(!showBorders))
                    }
                  >
                    <ShowBlockIcon />
                  </ToggleButton>
                </Box>
                <Box>
                  <ToggleButton
                    selected={showGrid}
                    value="grid"
                    className={classes.togglebutton}
                    onClick={() => dispatch(toggleGrid(!showGrid))}
                  >
                    <ShowGridIcon />
                  </ToggleButton>
                </Box>
              </>
            )}

            <a target="_blank" href={HELP_LINK} rel="noreferrer noopener">
              <IconButton className={classes.iconbutton} title="Help">
                <HelpOutlineIcon className={classes.icon} />
              </IconButton>
            </a>
            {!projectName && <Avatar />}
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
    </Appbar>
  );
}

export default TopPanel;
