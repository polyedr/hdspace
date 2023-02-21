import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  styled,
  AppBar as MUIAppbar,
  Toolbar,
  IconButton,
  Box,
  Theme,
  Tooltip,
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import { makeStyles } from '@mui/styles';
import {
  HelpOutline as HelpOutlineIcon,
  SettingsBackupRestore as SettingsBackupRestoreIcon,
  Apps as AppsIcon,
  ViewWeek as ViewWeekIcon,
} from '@mui/icons-material';
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

import { StyledIconButton } from '@Components/styledComponents';
import { HELP_LINK } from '@Src/config/settings';
import { useWireframe } from '@Src/hooks/useWireframe';
import Dialog from '../Dialogs/Dialog';
import Logo from '../UI/Logo';
import Layouts from './TopBar/Layouts';
import RenameProjectBar from './TopBar/RenameProjectBar';
import TopBar from './TopBar';
import History from './History';
import Avatar from './Avatar';
// import { ShowGridIcon, ShowBlockIcon } from './icons';
import ToggleMode from './TopBar/ToggleMode';

const Appbar = styled(MUIAppbar)({
  '&.MuiAppBar-root': {
    boxShadow: 'none',
    borderBottom: '1px solid #E4E6EB',
    zIndex: 1200,

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
    paddingRight: 5,
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
    '&.MuiToggleButton-root': {
      width: '32px',
      height: '32px',
      border: 'none',
      borderRadius: '50%',
      color: '#81818E',

      '& svg': {
        height: '20px',
      },

      '&.Mui-disabled': {
        color: 'rgba(0, 0, 0, 0.26)',
        border: 'none',
      },
    },
    '&.Mui-selected': {
      color: '#000',
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

  const { isWireframeMode } = useWireframe();

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
          {projectName && <ToggleMode />}
          {projectName && !isWireframeMode && <Layouts />}
        </Box>

        <Box className={classes.toolbar}>
          {viaMode ? <History /> : <TopBar />}

          {!viaMode && viaResultId && (
            <StyledIconButton title="Return to annotation">
              <SettingsBackupRestoreIcon className={classes.icon} />
            </StyledIconButton>
          )}

          <Box className={classes.toolbar}>
            {!isWireframeMode && projectName !== '' && (
              <>
                <Box>
                  <Tooltip title="Borders">
                    <ToggleButton
                      selected={showBorders}
                      value="borders"
                      className={classes.togglebutton}
                      disabled={!bordersEnabled && !isProtoMode}
                      onClick={() =>
                        dispatch(toggleContainersBorders(!showBorders))
                      }
                    >
                      <ViewWeekIcon />
                    </ToggleButton>
                  </Tooltip>
                </Box>
                <Box>
                  <Tooltip title="Grid">
                    <ToggleButton
                      selected={showGrid}
                      value="grid"
                      className={classes.togglebutton}
                      onClick={() => dispatch(toggleGrid(!showGrid))}
                    >
                      <AppsIcon />
                    </ToggleButton>
                  </Tooltip>
                </Box>
              </>
            )}

            <a target="_blank" href={HELP_LINK} rel="noreferrer noopener">
              <Tooltip title="Help">
                <IconButton className={classes.iconbutton}>
                  <HelpOutlineIcon className={classes.icon} />
                </IconButton>
              </Tooltip>
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
