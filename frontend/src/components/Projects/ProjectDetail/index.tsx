/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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
  TextField,
} from '@material-ui/core';
import {
  ExpandMore,
  SystemUpdateAlt,
  SettingsOutlined,
  Edit,
  Close,
  Add,
  VerticalAlignBottom,
} from '@material-ui/icons';

import {
  selectCurrentProjectId,
  selectProjectByIdWrapper,
  selectProjectLoader,
  selectCurrentProject,
} from '@Redux/project/selectors/base';
import {
  selectScreensWithoutMaster,
} from '@Redux/project/selectors/screen';
import { 
  getProject, 
  resetProjectState, 
  updateNameAndTagsProject,
  exportScreenFlag, 
} from '@Redux/project/actions';
import { enqueueSnackbar } from '@Redux/notification/actions';
import { Screen } from '@Src/types';
import exportHTML from '@Src/export/app';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import History from '@Components/Layout/History';
import Share from './Share';
import AddTags, { Tag } from './AddTags';
import Screens from '../Tabs/Screens';
import Activity from '../Tabs/Activity';
import RenameProjectBar from './RenameProjectBar';

import TeamMember from '../Tabs/Team';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    project: {
      padding: spacing(2),
      height: 1, // allows children use height in %
    },
    loader: {
      flex: 1,
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tagPopup: {
      padding: spacing(1),
    },
    chip: {
      height: 28,
      color: '#FFF',
      '& svg': {
        width: 18,
        height: 18,
        color: '#FFF',
        display: 'none',
      },
      '&:hover svg': {
        display: 'inline',
      },
    },
    addBtn: {
      padding: 3,
    },
    statusSelect: {
      backgroundColor: 'transparent',
      '&::before': {
        borderBottom: 'none !important',
      },
      '& .MuiSelect-select': {
        backgroundColor: 'transparent',
      },
    },
    badge: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      marginRight: 10,
    },
  }),
);

const StyledTabs = withStyles(({ spacing }) => ({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
  flexContainer: {
    gap: spacing(2),
  },
}))(Tabs);

const StyledTab = withStyles({
  root: {
    minWidth: 'unset',
    padding: 0,
  },
})(Tab);

type Props = {
  projectId: number;
  screenId?: number;
  elementId?: string;
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
};

const StyledIconButton = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
})(IconButton);

const StyledTextField = withStyles({
  root: {
    border: 'none',
  },
})(TextField);

const ProjectDetail: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const project = useSelector(selectProjectByIdWrapper(currentProjectId));
  const {
    name: projectName,
    tags,
  } = useSelector(selectCurrentProject);
  const projectLoader = useSelector(selectProjectLoader);
  const screens = useSelector(selectScreensWithoutMaster);
  
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

  useEffect(() => {
    dispatch(updateNameAndTagsProject(currentProjectId, projectName, selectedTags));
  }, [selectedTags]);

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const handleAdd = (data: Tag) => {
    const duplicated = !!selectedTags.find((item) => item.name === data.name);
    if (!duplicated) {
      setSelectedTags([...selectedTags, data]);
    }
    handleClosePopper();
  };

  const handleDelete = (idx: number) => {
    const temp: Tag[] = [...selectedTags];
    temp.splice(idx, 1);
    setSelectedTags(temp);
  };

  const handleCheck = (value: Tag) => {
    const temp: Tag[] = [...selectedTags];
    const idx = temp.findIndex((item) => item.name === value.name);
    if (idx > -1) {
      temp.splice(idx, 1);
    } else {
      temp.push(value);
    }
    setSelectedTags(temp);
  };

  const handleExportScreen = () => {
    if (screens.length > 0) {
      dispatch(exportScreenFlag(true));
      exportHTML(screens, projectName);
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
  };

  const handleRenameChange = (val: string) => {
    dispatch(updateNameAndTagsProject(currentProjectId, val, null));
  }

  return (
    <Container className={classes.project}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          All Projects
        </Link>
        <Typography color="textPrimary">{project && project.name}</Typography>
      </Breadcrumbs>
      <Grid
        container
        spacing={1}
        direction="column"
        style={{ marginTop: '10px' }}
      >
        <Grid item>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <RenameProjectBar
                projectName={projectName}
                onChange={handleRenameChange}
              />
            </Grid>
            <Grid item>
              <Grid container item spacing={2} alignItems="center">
                <Grid item>
                  <Select
                    autoWidth
                    IconComponent={ExpandMore}
                    className={classes.statusSelect}
                  >
                    {statuses.map((status) => (
                      <MenuItem value={status.label} key={status.label}>
                        <span
                          style={{
                            backgroundColor: status.color,
                          }}
                          className={classes.badge}
                        />
                        <span
                          style={{
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item>
                  <StyledIconButton aria-label="download" onClick={handleExportScreen}>
                    <VerticalAlignBottom />
                  </StyledIconButton>
                </Grid>
                <Grid item>
                  <Share />
                </Grid>
                <Grid item>
                  <StyledIconButton aria-label="settings">
                    <SettingsOutlined />
                  </StyledIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2} alignItems="center" style={{ margin: 0 }}>
            {selectedTags.map((item, index) => (
              <Grid item key={`${item.name}${item.color}`}>
                <Chip
                  label={item.name}
                  style={{ backgroundColor: item.color }}
                  className={classes.chip}
                  onDelete={() => handleDelete(index)}
                  deleteIcon={<Close />}
                />
              </Grid>
            ))}
            {selectedTags.length === 0 && (
              <Typography variant="body2">Add tag</Typography>
            )}
            <Grid item>
              <StyledIconButton
                className={classes.addBtn}
                aria-describedby={id}
                onClick={handleOpen}
              >
                <Add />
              </StyledIconButton>
              <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                transition
              >
                <AddTags
                  tagsData={selectedTags}
                  selectedTags={selectedTags}
                  onAdd={handleAdd}
                  onClose={handleClosePopper}
                  onCheck={handleCheck}
                />
              </Popper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <StyledTabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <StyledTab label="Screens" disableRipple {...a11yProps(0)} />
            <StyledTab label="Activity" disableRipple {...a11yProps(1)} />
            <StyledTab label="Board" disableRipple {...a11yProps(2)} />
            <StyledTab label="Chat" disableRipple {...a11yProps(3)} />
            <StyledTab label="Team" disableRipple {...a11yProps(4)} />
          </StyledTabs>
          <TabPanel value={value} index={0}>
            <Screens projectId={projectId} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Activity projectId={projectId} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            Board
          </TabPanel>
          <TabPanel value={value} index={3}>
            Chat
          </TabPanel>
          <TabPanel value={value} index={4}>
            Team
            <TeamMember />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectDetail;
