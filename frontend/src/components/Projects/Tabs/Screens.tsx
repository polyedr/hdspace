/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  selectCurrentProjectId,
  selectProjectByIdWrapper,
  selectProjectLoader,
} from '@Redux/project/selectors/base';
import { getProject, resetProjectState } from '@Redux/project/actions';
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
  FileCopy,
  Delete,
  SystemUpdateAlt,
  Share,
  Edit,
  Add,
  MoreHoriz,
} from '@material-ui/icons';
import { selectSortedScreens } from '@Redux/project/selectors/screen';
import { Screen } from '@Src/types';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';

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
  const screens = useSelector(selectSortedScreens);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const menus = [
    { label: 'Edit', icon: <Edit fontSize='small' /> },
    { label: 'Copy', icon: <FileCopy fontSize='small' /> },
    { label: 'Share', icon: <Share fontSize='small' /> },
    { label: 'Export', icon: <SystemUpdateAlt fontSize='small' /> },
    { label: 'Delete', icon: <Delete fontSize='small' /> },
  ];

  const handleOpen = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const getInitialScreenId = (screens: Screen[]) => {
    const sorted = screens.sort((a, b) => a.buoyancy - b.buoyancy);
    return sorted[1]?.id || sorted[0]?.id;
  };

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

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <Grid container spacing={1}>
      <Grid item xs={3}>
        <div className={classes.addScreen}>
          <StyledIconButton>
            <Add />
          </StyledIconButton>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className={classes.screen}>
          <div 
            className="screen-img" 
            style={{ backgroundImage: 'url(https://picsum.photos/seed/picsum/200/300)' }} 
          />
          <div className="screen-name">
            screen1
          </div>
          <div className="screen-action">
            <IconButton
              aria-controls="simple-menu" 
              aria-haspopup="true"
              onClick={handleOpen}
            >
              <MoreHoriz />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {
                menus.map((item) => (
                  <MenuItem key={item.label} onClick={handleClose}>
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
    </Grid>
  );
};

export default Screens;
