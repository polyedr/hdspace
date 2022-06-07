/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  selectCurrentProjectId,
  selectProjectByIdWrapper,
  selectProjectLoader,
  selectScreenCreateLoader,
} from '@Redux/project/selectors/base';
import { 
  getProject, 
  resetProjectState, 
  createScreen, 
  editScreenNameAndData,
  duplicateScreen,
  deleteScreen,
} from '@Redux/project/actions';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import {
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  FileCopyOutlined,
  Delete,
  SystemUpdateAlt,
  Share,
  Edit,
  Add,
  MoreHoriz,
} from '@material-ui/icons';

import { Screen } from '@Src/types';
import { selectSortedScreens } from '@Redux/project/selectors/screen';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import ScreenEditDialog from '@Components/LeftPanel/Screens/ScreenEditDialog';
import ConfirmDialog from '@Components/Dialogs/ConfirmDialog';
import ShareDialog from '@Components/Projects/Tabs/Screens/shareDialog';
import prevent from '@Utils/preventEvent';
import { exportScreenFlag } from '@Redux/project/actions';
import exportHTML from '@Src/export/app';
import { enqueueSnackbar } from '@Redux/notification/actions';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    addScreen: {
      height: 182,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px dashed #B0B0BD',
      borderRadius: 6,
    },
    screen: {
      height: 182,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 4,
      boxShadow: '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.06)',
      position: 'relative',
      '&:hover': {
        '& .screen-action': {
          display: 'inline',
        }
      },
      '& .screen-img': {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        flex: 1,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
      },
      '& .screen-name': {
        height: 45,
        padding: '12px 16px',
        borderTop: '1px solid #F3F4F6',
      },
      '& .screen-action': {
        position: 'absolute',
        right: 10,
        top: 10,
        display: 'none',
        '& button': {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    menu: {
      boxShadow: '0px 0px 1px rgba(55, 56, 60, 0.12), 0px 2px 6px rgba(55, 56, 60, 0.1)',
    }
  }),
);

const StyledIconButton = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
})(IconButton);

type Props = {
  projectId: number;
  screenId?: number;
  elementId?: string;
};

const Screens: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const project = useSelector(selectProjectByIdWrapper(currentProjectId));
  const projectLoader = useSelector(selectProjectLoader);
  const screenCreateLoader = useSelector(selectScreenCreateLoader);
  const screens = useSelector(selectSortedScreens);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createAnchorEl, setCreateAnchorEl] = useState(null);
  const [selectedScreenIndex, setSelectedScreenIndex] = useState(-1);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const menus = [
    { 
      label: 'Edit', 
      icon: <Edit fontSize='small' />,
      action: (values: any) => {
        setOpenEditDialog(true);
        handleClose();
      },
    },
    { 
      label: 'Copy', 
      icon: <FileCopyOutlined fontSize='small' />,
      action: (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const { name, id } = screens[selectedScreenIndex];
        dispatch(duplicateScreen(name, id));
      },
    },
    { 
      label: 'Share', 
      icon: <Share fontSize='small' />,
      action: () => {
        setOpenShareDialog(true);
        handleClose();
      },
    },
    { 
      label: 'Export', 
      icon: <SystemUpdateAlt fontSize='small' />,
      action: () => {
        if (screens.length > 0) {
          dispatch(exportScreenFlag(true));
          exportHTML(screens, project.name);
          dispatch(exportScreenFlag(false));
        } else {
          dispatch(
            enqueueSnackbar({
              message: `Must be expert at least one screen.`,
              options: {
                variant: 'error',
              },
            }),
          );
        }
      },
    },
    { 
      label: 'Delete', 
      icon: <Delete fontSize='small' />,
      action: () => {
        setOpenConfirmDialog(true);
        handleClose();
      },
    },
  ];

  useEffect(() => {
    if (currentProjectId !== projectId) {
      dispatch(getProject(projectId));
    }
  }, [dispatch, projectId, currentProjectId]);

  useEffect(
    () => () => {
      dispatch(resetProjectState());
      DOMHandler.INSTANCE.reset();
    },
    [dispatch],
  );

  const handleOpen = (event, index: number) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setSelectedScreenIndex(index);
  };

  const handleOpenScreen = (event) => {
    setCreateAnchorEl(createAnchorEl ? null : event.currentTarget);
  };

  const getInitialScreenId = (screens: Screen[]) => {
    const sorted = screens.sort((a, b) => a.buoyancy - b.buoyancy);
    return sorted[1]?.id || sorted[0]?.id;
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCreateAnchorEl(null);
  };

  const handleCreateScreen = (isFreeCanvas: boolean = false) => {
    dispatch(
      createScreen({
        projectID: currentProjectId,
        name: 'Screen-1',
        buoyancy: screens.length + 1, // + 1 because masterScreen should always have buoyancy 0
        freeCanvas: isFreeCanvas,
      }),
    );
  };

  const handleEdit = (values) => {
    const { name: newScreenName, faviconUrl, ...metaValues } = values;
    const { project, id } = screens[selectedScreenIndex];
    dispatch(
      editScreenNameAndData(project, id, {
        name: newScreenName,
        data: {
          meta: {
            ...metaValues,
            faviconUrl: faviconUrl || null,
          },
        },
      }),
    );
    handleClose();
  };

  const handleDelete = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { project, id } = screens[selectedScreenIndex];
    dispatch(deleteScreen(project, id));
    setOpenConfirmDialog(false);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <div className={classes.addScreen}>
          <StyledIconButton  
            title="Create Screen"
            size="small"
            onClick={handleOpenScreen}
            disabled={screenCreateLoader}
          >
            <Add />
          </StyledIconButton>
          <Menu
            anchorEl={createAnchorEl}
            keepMounted
            open={Boolean(createAnchorEl)}
            onClose={handleOpenScreen}
          >
            <MenuItem
              onClick={(ev) => {
                prevent(ev);
                handleCreateScreen(false);
                handleClose();
              }}
            >
              Common mode
            </MenuItem>

            <MenuItem
              onClick={(ev) => {
                prevent(ev);
                handleCreateScreen(true);
                handleClose();
              }}
            >
              Free canvas mode
            </MenuItem>
          </Menu>
        </div>
      </Grid>
      {
        screens.map((item, index: number) => (
          <Grid key={item.id} item xs={3}>
            <div className={classes.screen}>
              <div 
                className="screen-img" 
                style={{ backgroundImage: item.image || 'url(https://picsum.photos/seed/picsum/200/300)' }} 
              />
              <div className="screen-name">
                { item.name }
              </div>
              <div className="screen-action">
                <IconButton
                  aria-controls="simple-menu" 
                  aria-haspopup="true"
                  onClick={e => handleOpen(e, index)}
                >
                  <MoreHoriz />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PopoverClasses={{ paper: classes.menu }}
                >
                  {
                    menus.map((item) => (
                      <MenuItem key={item.label} onClick={item.action}>
                        <ListItemIcon>
                          { item.icon }
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </MenuItem>
                    ))
                  }
                </Menu>
              </div>
            </div>
          </Grid>
        ))
      }
      {openConfirmDialog && (
        <ConfirmDialog
          open={openConfirmDialog}
          title="Delete screen"
          description={`Are you sure you want to delete the "${screens[selectedScreenIndex].name || ''}" screen?`}
          onDelete={handleDelete}
          onClose={() => setOpenConfirmDialog(false)}
        />
      )}
      {openShareDialog && (
        <ShareDialog
          open={openShareDialog}
          onClose={() => setOpenShareDialog(false)}
          onInvite={() => {}}
        />
      )}
      {openEditDialog && (
        <ScreenEditDialog
          open={openEditDialog}
          onSubmit={handleEdit}
          onClose={() => setOpenEditDialog(false)}
          titleDialog="Rename Screen"
          initialValueName={screens[selectedScreenIndex].name}
          initialValueTags={screens[selectedScreenIndex].screenData?.meta || {}}
          currentScreenId={screens[selectedScreenIndex].id}
          project={screens[selectedScreenIndex].project}
        />
      )}
    </Grid>
  );
};

export default Screens;
