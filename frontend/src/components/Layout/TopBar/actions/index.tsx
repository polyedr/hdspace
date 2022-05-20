import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { changePrototypeMode } from '@Redux/user/actions';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { StyledIconButton } from '@Components/styledComponents';
import { setBordersEnabled, exportScreenFlag } from '@Redux/project/actions';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HELP_LINK } from '@Src/config/settings';
import { PANEL_TRANSITION_DURATION } from '@Src/styles/Theme';
import {
  selectUpdateScreenImageLoader,
  selectCurrentProject,
} from '@Redux/project/selectors/base';
import {
  selectFreeCanvasMode,
  selectScreensWithoutMaster,
} from '@Redux/project/selectors/screen';

import exportHTML from '@Src/export/app';
import History from '@Components/Layout/History';
import { enqueueSnackbar } from '@Redux/notification/actions';
import Share from './Share';

const useStyles = makeStyles(({ palette, typography }) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  switch: {
    padding: '0 1em',
  },
  title: {
    fontSize: typography.fontSize,
  },
  iconButton: {
    color: palette.common.white,
    '&.Mui-disabled': {
      color: '#888',
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
}));

const Actions: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const imageLoader = useSelector(selectUpdateScreenImageLoader);
  const canvasMode = useSelector(selectFreeCanvasMode);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const screens = useSelector(selectScreensWithoutMaster);
  const { name: projectName } = useSelector(selectCurrentProject);
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const enableBordersDebounce = useDebouncedCallback(() => {
    dispatch(setBordersEnabled(true));
  }, PANEL_TRANSITION_DURATION + 120);
  const handleToggleProtoMode = useCallback(() => {
    dispatch(setBordersEnabled(false));
    dispatch(changePrototypeMode(!isProtoMode));
    enableBordersDebounce.callback();
  }, [dispatch, isProtoMode, enableBordersDebounce]);

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

  return (
    <div className={classes.root}>
      <History />
      <a
        className={classes.helpTextStyle}
        target="_blank"
        href={HELP_LINK}
        rel="noreferrer noopener"
      >
        Help
      </a>
      <StyledIconButton
        onClick={handleToggleProtoMode}
        title="Proto mode"
        disabled={imageLoader || canvasMode}
      >
        <VisibilityOutlinedIcon
          sx={{ color: isPrototypeMode ? '#5064FF' : '#81818E' }}
        />
      </StyledIconButton>

      <IconButton
        onClick={handleExportScreen}
        title="Export screen"
        className={classes.iconButton}
      >
        <FileDownloadOutlinedIcon className={classes.greyIcon} />
      </IconButton>

      <Share />
    </div>
  );
};

export default Actions;
