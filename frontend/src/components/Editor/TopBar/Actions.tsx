import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveIcon from '@material-ui/icons/Save';
import { useDispatch, useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectCurrentScreenId,
  selectRedoActions,
  selectUndoActions,
} from '../../../redux/project/selectors';
import {
  redoAction,
  saveScreenImage,
  undoAction,
} from '../../../redux/project/actions';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
});

const Actions: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);

  const undoLength = useSelector(selectUndoActions).length;
  const redoLength = useSelector(selectRedoActions).length;
  const onHistoryBack = () => dispatch(undoAction());

  const onHistoryForward = () => dispatch(redoAction());

  const handleSaveScreen = () => {
    const screenBody = document.getElementById('root');
    const widgets = Array.from(document.querySelectorAll('iframe'));

    if (screenBody !== null) {
      const ignore = (element: Element) =>
        widgets.some((widget) => element === widget);

      html2canvas(screenBody, {
        useCORS: true,
        allowTaint: true,
        logging: true,
        ignoreElements: ignore,
      }).then((canvas) => dispatch(saveScreenImage(currentScreenId, canvas)));
    }
  };

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

      <IconButton onClick={handleSaveScreen} title="Save screen">
        <SaveIcon />
      </IconButton>
    </div>
  );
};

export default Actions;
