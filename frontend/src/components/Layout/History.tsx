import React, { FC } from 'react';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { useDispatch, useSelector } from 'react-redux';
import { selectCanUndo, selectCanRedo } from '@Redux/project/selectors/control';
import { executeUndoActions, executeRedoActions } from '@Redux/project/actions';
import { StyledIconButton } from '@Components/styledComponents';
import { makeStyles } from '@material-ui/core/styles';

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

  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const onHistoryBack = () => dispatch(executeUndoActions());

  const onHistoryForward = () => dispatch(executeRedoActions());

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
