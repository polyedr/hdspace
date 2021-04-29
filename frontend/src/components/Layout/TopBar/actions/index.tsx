import React from 'react';
import SaveIcon from '@material-ui/icons/Save';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, IconButton } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
  selectFreeCanvasMode,
  selectUpdateScreenImageLoader,
} from '@Redux/project/selectors/base';
import { selectCurrentScreen } from '@Redux/project/selectors/screen';
import { updateScreenImage } from '@Redux/project/actions';

import exportHTML from '@Src/export/app';
import History from '@Components/Layout/History';
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
  const { id, name, screen_data_json } = useSelector(selectCurrentScreen);
  const imageLoader = useSelector(selectUpdateScreenImageLoader);
  const canvasMode = useSelector(selectFreeCanvasMode);

  const handleSaveScreen = () => dispatch(updateScreenImage(id));

  const handleExportScreen = () => {
    exportHTML(name, screen_data_json);
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
        {!imageLoader ? <SaveIcon /> : <CircularProgress size={24} />}
      </IconButton>

      <IconButton
        onClick={handleExportScreen}
        title="Export screen"
        className={classes.iconButton}
      >
        <VerticalAlignBottomIcon />
      </IconButton>

      <Share className={classes.iconButton} />
    </div>
  );
};

export default Actions;
