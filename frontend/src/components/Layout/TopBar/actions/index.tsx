import React, { useCallback } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import { IconButton, Theme, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { setBordersEnabled, exportScreenFlag } from '@Redux/project/actions';
import { changePrototypeMode } from '@Redux/user/actions';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { PANEL_TRANSITION_DURATION } from '@Src/styles/Theme';
import {
  selectUpdateScreenImageLoader,
  selectCurrentProject,
} from '@Redux/project/selectors/base';
import { selectScreensWithoutMaster } from '@Redux/project/selectors/screen';

import exportHTML from '@Src/export/app';
import History from '@Components/Layout/History';
import { enqueueSnackbar } from '@Redux/notification/actions';
import Share from './Share';

const useStyles = makeStyles<Theme>(({ typography }) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  switch: {
    padding: '0 1em',
  },
  title: {
    fontSize: typography.fontSize,
  },
  iconButton: {
    '&.MuiIconButton-root': {
      width: '32px',
      height: '32px',
      color: '#81818E',

      '& svg': {
        height: '20px',
      },
    },
  },
  helpTextStyle: {
    textDecoration: 'none',
    color: '#81818E',
    '&:hover': {
      cursor: 'pointer',
    },
    margin: '10px',
  },
  greyIcon: {
    color: '#81818E',
    height: 'large',
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
  icon: {
    width: '20px !important',
  },
}));

const Actions: React.FC = () => {
  const classes = useStyles();
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const dispatch = useDispatch();
  const imageLoader = useSelector(selectUpdateScreenImageLoader);
  // const canvasMode = useSelector(selectFreeCanvasMode);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const screens = useSelector(selectScreensWithoutMaster);
  const { name: projectName } = useSelector(selectCurrentProject);

  const enableBordersDebounce = useDebouncedCallback(() => {
    dispatch(setBordersEnabled(true));
  }, PANEL_TRANSITION_DURATION + 120);

  const handleToggleProtoMode = useCallback(() => {
    batch(() => {
      dispatch(setBordersEnabled(false));
      dispatch(changePrototypeMode(!isProtoMode));
    });
    enableBordersDebounce.callback();
  }, [dispatch, enableBordersDebounce, isProtoMode]);

  const handleExportScreen = () => {
    if (screens.length > 0) {
      dispatch(exportScreenFlag(true));
      exportHTML(screens, projectName);
      dispatch(exportScreenFlag(false));
    } else {
      dispatch(
        enqueueSnackbar({
          message: 'Must be expert at least one screen.',
          options: {
            variant: 'error',
          },
        }),
      );
    }
  };

  return (
    <div className={classes.root}>
      <History />
      <Tooltip title="Proto mode">
        <span>
          <ToggleButton
            className={classes.togglebutton}
            value="Proto mode"
            onClick={handleToggleProtoMode}
            disabled={imageLoader}
            selected={isPrototypeMode}
          >
            <VisibilityOutlinedIcon className={classes.icon} />
          </ToggleButton>
        </span>
      </Tooltip>

      <Tooltip title="Export screen">
        <IconButton onClick={handleExportScreen} className={classes.iconButton}>
          <FileDownloadOutlinedIcon className={classes.icon} />
        </IconButton>
      </Tooltip>

      <Share />
    </div>
  );
};

export default Actions;
