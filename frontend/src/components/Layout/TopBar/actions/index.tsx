import React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress,
  IconButton,
  Box,
  Typography,
} from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  selectUpdateScreenImageLoader,
  selectCurrentProject,
} from '@Redux/project/selectors/base';
import {
  selectCurrentScreen,
  selectFreeCanvasMode,
  selectScreensWithoutMaster,
} from '@Redux/project/selectors/screen';
import { updateScreenImage } from '@Redux/project/actions';

import exportHTML from '@Src/export/app';
import History from '@Components/Layout/History';
import { enqueueSnackbar } from '@Redux/notification/actions';
import Share from './Share';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  iconButton: {
    color: palette.common.white,
    '&:hover': {
      backgroundColor: lighten(palette.panel.main, 0.1),
    },
    '&.Mui-disabled': {
      color: '#888',
    },
  },
}));

const Actions: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useSelector(selectCurrentScreen);
  const imageLoader = useSelector(selectUpdateScreenImageLoader);
  const canvasMode = useSelector(selectFreeCanvasMode);
  const screens = useSelector(selectScreensWithoutMaster);
  const { name: projectName } = useSelector(selectCurrentProject);

  const handleSaveScreen = () => dispatch(updateScreenImage(id));

  const handleExportScreen = () => {
    if (screens.length > 0) {
      exportHTML(screens, projectName);
    } else {
      dispatch(
        enqueueSnackbar({
          message: `Must be export atlest one screen.`,
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

      <IconButton
        onClick={handleSaveScreen}
        title="Save screen"
        disabled={imageLoader || canvasMode}
        className={classes.iconButton}
      >
        <Box component="div">
          {!imageLoader ? <SaveIcon /> : <CircularProgress size={24} />}
          <Typography variant="body1">Save screen</Typography>
        </Box>
      </IconButton>

      <IconButton
        onClick={handleExportScreen}
        title="Export screen"
        className={classes.iconButton}
      >
        <Box component="div">
          <VerticalAlignBottomIcon />
          <Typography variant="body1">Export screen</Typography>
        </Box>
      </IconButton>

      <Share className={classes.iconButton} />
    </div>
  );
};

export default Actions;
