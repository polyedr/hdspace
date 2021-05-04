import React, { FC } from 'react';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { useDispatch, useSelector } from 'react-redux';
import { selectCanUndo, selectCanRedo } from '@Redux/project/selectors/control';
import { executeUndoActions, executeRedoActions } from '@Redux/project/actions';
import { StyledIconButton } from '@Components/styledComponents';

const History: FC = () => {
  const dispatch = useDispatch();

  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const onHistoryBack = () => dispatch(executeUndoActions());

  const onHistoryForward = () => dispatch(executeRedoActions());

  return (
    <div>
      <StyledIconButton
        onClick={onHistoryBack}
        disabled={!canUndo}
        title="Undo"
      >
        <UndoIcon />
      </StyledIconButton>

      <StyledIconButton
        onClick={onHistoryForward}
        disabled={!canRedo}
        title="Redo"
      >
        <RedoIcon />
      </StyledIconButton>
    </div>
  );
};

export default History;
