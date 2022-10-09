/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import {
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  FileCopy,
  Delete,
  SystemUpdateAlt,
  Share,
  Edit,
  Add,
  MoreHoriz,
  Sync,
  FilterList,
  Close,
} from '@material-ui/icons';

import {
  selectCurrentProjectId,
  selectProjectByIdWrapper,
  selectProjectLoader,
} from '@Redux/project/selectors/base';
import {
  clearHistoryAction,
  requestGetAction,
} from '@Redux/pmtools/activity/actions';
import selectActions from '@Redux/pmtools/activity/selectors';
import { getProject, resetProjectState } from '@Redux/project/actions';
import { selectSortedScreens } from '@Redux/project/selectors/screen';
import { selectAllUsersPermissions } from '@Redux/permissions/selectors';
import { Screen } from '@Src/types';
import { ActionTypePM, PlatformActionData } from '@Src/types/pmtools/types';
import { DOMHandler } from '@Components/Editor/Workspace/DOMHandler';
import History from './History';

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
    textField: {
      marginLeft: spacing(1),
      marginRight: spacing(1),
      width: 200,
    },
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

const Activity: React.FC<Props> = ({ projectId, screenId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const currentProjectId = useSelector(selectCurrentProjectId);
  const project = useSelector(selectProjectByIdWrapper(currentProjectId));
  const projectLoader = useSelector(selectProjectLoader);
  const activities: Array<ActionTypePM> = useSelector(selectActions);
  const screens = useSelector(selectSortedScreens);
  const members = useSelector(selectAllUsersPermissions);
  console.log(members);

  const [platform, setPlatform] = useState<PlatformActionData>('ALL');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  useEffect(() => {
    if(currentProjectId > -1) {
      dispatch(requestGetAction(currentProjectId));
    }
  }, [dispatch, project]);

  useEffect(
    () => () => {
      dispatch(resetProjectState());
      DOMHandler.INSTANCE.reset();
    },
    [dispatch],
  );

  const handleRefresh = () => {
    dispatch(requestGetAction(currentProjectId));
  };

  const handlePlatformChange = (e) => {
    setPlatform(e.target.value);
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Grid container spacing={3}>
      <Grid container item spacing={3} alignItems="center">
        <Grid item>
          <Button onClick={handleRefresh}>
            <Sync fontSize='small' />
            Refresh
          </Button>
        </Grid>
        <Grid item>
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
            <Select
              value={platform}
              onChange={handlePlatformChange}
              label="Type"
              style={{ width: 150 }}
            >
              <MenuItem value='board'>Board</MenuItem>
              <MenuItem value='editor'>Editor</MenuItem>
              <MenuItem value='members'>Members</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Autocomplete
            options={[{name: 'me'}]}
            getOptionLabel={(option) => option.name}
            style={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="User" variant="outlined" />}
          />
        </Grid>
        <Grid item>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              label="Date"
              inputVariant="outlined"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item>
          <Button>
            <Close fontSize='small' /> Reset Filters
          </Button>
        </Grid>
        <Grid item>
          <IconButton>
            <FilterList fontSize='small' />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container item spacing={1}>
        {activities.map((item, i) => (
          <History key={i} activity={item} platform={platform} />
        ))}
      </Grid>
    </Grid>
  );
};

export default Activity;
