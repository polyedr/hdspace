import React, { FC } from 'react';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { Box, Typography } from '@material-ui/core';
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
        <Box component="div">
          <UndoIcon />
          <Typography variant="body1">Undo</Typography>
        </Box>
      </StyledIconButton>

      <StyledIconButton
        onClick={onHistoryForward}
        disabled={!canRedo}
        title="Redo"
      >
        <Box component="div">
          <RedoIcon />
          <Typography variant="body1">Redo</Typography>
        </Box>
      </StyledIconButton>
    </div>
  );
};

export default History;
