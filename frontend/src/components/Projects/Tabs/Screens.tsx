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
import PropTypes from 'prop-types';
import {
  Box,
  Badge,
  Breadcrumbs,
  Container,
  Chip,
  Grid,
  IconButton,
  Select,
  MenuItem,
  Link,
  Popper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core';
import {
  ExpandMore,
  SystemUpdateAlt,
  Share,
  SettingsOutlined,
  Edit,
  Close,
  Add,
} from '@material-ui/icons';
import { selectSortedScreens } from '@Redux/project/selectors/screen';
import { Screen } from '@Src/types';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import AddTags, { Tag } from './AddTags';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    addScreen: {
      height: 182,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

const StyledIconButton = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
})(IconButton);

interface Props {
  projectId: number;
  screenId: number;
}

const Screens: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const project = useSelector(selectProjectByIdWrapper(currentProjectId));
  const projectLoader = useSelector(selectProjectLoader);
  const screens = useSelector(selectSortedScreens);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userTags, setUserTags] = useState<Array<Tag>>([]);
  const [value, setValue] = React.useState(0);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const statuses = [
    { color: '#5064FF', label: 'In progress' },
    { color: '#81818E', label: 'Paused' },
    { color: '#1CC09F', label: 'Accepted' },
    { color: '#FAB200', label: 'Waiting for review' },
  ];

  const handleOpen = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const handleClosePopper = () => {
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
        <div className="screen">
          <div className="screen-img" />
          <div className="screen-name">screen1</div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Screens;
