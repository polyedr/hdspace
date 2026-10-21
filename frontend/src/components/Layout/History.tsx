import React, { FC } from 'react';
import { Undo as UndoIcon, Redo as RedoIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Tooltip } from '@mui/material';
import { selectCanUndo, selectCanRedo } from '@Redux/project/selectors/control';
import { executeUndoActions, executeRedoActions } from '@Redux/project/actions';
import { StyledIconButton } from '@Components/styledComponents';

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

  const onHistoryBack = () => {
    dispatch(executeUndoActions());
  };

  const onHistoryForward = () => {
    dispatch(executeRedoActions());
  };

  return (
    <div className={classes.root}>
      <Tooltip title="Undo">
        <span>
          <StyledIconButton onClick={onHistoryBack} disabled={!canUndoEditor}>
            <UndoIcon className={classes.icon} />
          </StyledIconButton>
        </span>
      </Tooltip>

      <Tooltip title="Redo">
        <span>
          <StyledIconButton onClick={onHistoryForward} disabled={!canRedoEditor}>
            <RedoIcon className={classes.icon} />
          </StyledIconButton>
        </span>
      </Tooltip>
    </div>
  );
};

export default History;
