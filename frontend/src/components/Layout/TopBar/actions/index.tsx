import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveIcon from '@material-ui/icons/Save';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CircularProgress, lighten } from '@material-ui/core';
import {
  selectFreeCanvasMode,
  selectUpdateScreenImageLoader,
} from '@Redux/project/selectors/base';
import { selectCanUndo, selectCanRedo } from '@Redux/project/selectors/control';
import { selectCurrentScreen } from '@Redux/project/selectors/screen';
import {
  executeUndoActions,
  updateScreenImage,
  executeRedoActions,
} from '@Redux/project/actions';

import exportHTML from '@Src/export/app';

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
  const currentScreen = useSelector(selectCurrentScreen);
  const imageLoader = useSelector(selectUpdateScreenImageLoader);
  const canvasMode = useSelector(selectFreeCanvasMode);

  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const onHistoryBack = () => dispatch(executeUndoActions());

  const onHistoryForward = () => dispatch(executeRedoActions());

  const handleSaveScreen = () => dispatch(updateScreenImage(currentScreen.id));

  const handleExportScreen = () => {
    exportHTML(currentScreen.name);
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={onHistoryBack}
        disabled={!canUndo}
        title="Undo"
        className={classes.iconButton}
      >
        <UndoIcon />
      </IconButton>

      <IconButton
        onClick={onHistoryForward}
        disabled={!canRedo}
        title="Redo"
        className={classes.iconButton}
      >
        <RedoIcon />
      </IconButton>

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
    </div>
  );
};

export default Actions;
