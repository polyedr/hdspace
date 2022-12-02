import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsPrototypeMode, selectUserData } from '@Redux/user/selectors';
import {
  selectCurrentProject,
  selectSidebarOpen,
  selectBordersEnabled,
  selectShowingBorders,
} from '@Redux/project/selectors/base';
import {
  updateNameAndTagsProject,
  setSidebarOpen,
  toggleContainersBorders,
} from '@Redux/project/actions';
import {
  selectVIAModeEnabled,
  selectVIAResultId,
} from '@Redux/project/selectors/via';

import {
  FormControlLabel,
  Typography,
  Checkbox,
  ToggleButton,
  Menu,
  MenuItem,
  styled,
} from '@mui/material';
import {
  AppBar as MUIAppbar,
  Toolbar,
  IconButton,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { StyledIconButton } from '@Components/styledComponents';
import { HELP_LINK } from '@Src/config/settings';
import Dialog from '../Dialogs/Dialog';
import Layouts from './TopBar/Layouts';
import ShowGrid from './TopBar/ShowGrid';
import RenameProjectBar from './TopBar/RenameProjectBar';
import TopBar from './TopBar';
import History from './History';
import Logo from '../UI/Logo';
import Avatar from './Avatar';

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

const useStyles = makeStyles(({ typography, palette }) => ({
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
    width: '16px !important',
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
  const bordersEnabled = useSelector(selectBordersEnabled);
  const handleEditClick = () => setOpenEdit(true);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const showBorders = useSelector(selectShowingBorders);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: {
    currentTarget: React.SetStateAction<HTMLElement | null>;
  }) => {
    setIsDropdownOpen(true);
    setAnchorEl(event.currentTarget);
  };
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

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  const handleCloseDropDown = () => {
    setIsDropdownOpen(false);
    setAnchorEl(null);
  };
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
              <ToggleButton
                value="DropDown"
                selected={isDropdownOpen}
                className={classes.togglebutton}
                onClick={handleClick}
              >
                <SettingsOutlinedIcon className={classes.icon} />
              </ToggleButton>
            )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseDropDown}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>
                <ShowGrid />
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="Show borders"
                      checked={showBorders}
                      disabled={!bordersEnabled && !isProtoMode}
                      onChange={() =>
                        dispatch(toggleContainersBorders(!showBorders))
                      }
                    />
                  }
                  label={
                    <Typography className={classes.title}>
                      Show blocks
                    </Typography>
                  }
                />
              </MenuItem>
            </Menu>
            <a target="_blank" href={HELP_LINK} rel="noreferrer noopener">
              <IconButton className={classes.iconbutton} title="Help">
                <HelpOutlineIcon className={classes.icon} />
              </IconButton>
            </a>
            {projectName ? (
              <ToggleButton
                value="sidebarOpen"
                selected={sidebarOpen}
                onClick={handleSidebarToggle}
                title="Toggle Sidebar"
                className={classes.togglebutton}
              >
                <MenuIcon className={classes.icon} />
              </ToggleButton>
            ) : (
              <Avatar />
            )}
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
};

export default TopPanel;
