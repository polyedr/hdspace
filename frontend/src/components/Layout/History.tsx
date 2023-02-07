import React, { FC } from 'react';
import { Undo as UndoIcon, Redo as RedoIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { selectCanUndo, selectCanRedo } from '@Redux/project/selectors/control';
import { executeUndoActions, executeRedoActions } from '@Redux/project/actions';
import { StyledIconButton } from '@Components/styledComponents';
import { useWireframe } from '@Src/hooks/useWireframe';
import {
  selectCanRedoWireframe,
  selectCanUndoWireframe,
} from '@Redux/wireframe/selectors';

const useStyles = makeStyles({
  root: {
    gap: '8px',
    display: 'flex',
    color: '#81818E',
    alignItems: 'center',
    flexDirection: 'row',
    // marginRight: '24px',
  },
  icon: {
    width: '20px',
  },
});

const History: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const canUndoEditor = useSelector(selectCanUndo);
  const canRedoEditor = useSelector(selectCanRedo);

  const canUndoWireframe = useSelector(selectCanUndoWireframe);
  const canRedoWireframe = useSelector(selectCanRedoWireframe);

  const { isWireframeMode, undo, redo } = useWireframe();

  const onHistoryBack = () => {
    if (isWireframeMode) {
      undo();
    } else {
      dispatch(executeUndoActions());
    }
  };

  const onHistoryForward = () => {
    if (isWireframeMode) {
      redo();
    } else {
      dispatch(executeRedoActions());
    }
  };

  const canUndo = isWireframeMode ? canUndoWireframe : canUndoEditor;
  const canRedo = isWireframeMode ? canRedoWireframe : canRedoEditor;

  return (
    <div className={classes.root}>
      <StyledIconButton
        onClick={onHistoryBack}
        disabled={!canUndo}
        title="Undo"
      >
        <UndoIcon className={classes.icon} />
      </StyledIconButton>

      <StyledIconButton
        onClick={onHistoryForward}
        disabled={!canRedo}
        title="Redo"
      >
        <RedoIcon className={classes.icon} />
      </StyledIconButton>
    </div>
  );
};

export default History;
