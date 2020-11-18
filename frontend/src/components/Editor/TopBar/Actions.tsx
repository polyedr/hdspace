import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CircularProgress } from '@material-ui/core';
import {
  selectCurrentScreenId,
  selectRedoActions,
  selectUndoActions,
  selectUpdateScreenImageLoader,
} from '../../../redux/project/selectors';
import {
  redoAction,
  updateScreenImage,
  undoAction,
} from '../../../redux/project/actions';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
});

const Actions: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const imageLoader = useSelector(selectUpdateScreenImageLoader);

  const undoLength = useSelector(selectUndoActions).length;
  const redoLength = useSelector(selectRedoActions).length;
  const onHistoryBack = () => dispatch(undoAction());

  const onHistoryForward = () => dispatch(redoAction());

  const handleSaveScreen = () => dispatch(updateScreenImage(currentScreenId));

  return (
    <div className={classes.root}>
      <IconButton onClick={onHistoryBack} disabled={!undoLength} title="Undo">
        <UndoIcon />
      </IconButton>

      <IconButton
        onClick={onHistoryForward}
        disabled={!redoLength}
        title="Redo"
      >
        <RedoIcon />
      </IconButton>

      <IconButton
        onClick={handleSaveScreen}
        title="Save screen"
        disabled={imageLoader}
      >
        {!imageLoader ? <SaveIcon /> : <CircularProgress size={24} />}
      </IconButton>
    </div>
  );
};

export default Actions;
