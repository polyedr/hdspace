import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import FreeDraggable from './FreeDraggable';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectDirectRootChildren,
} from '../../../redux/project/selectors';
import { setActiveElement } from '../../../redux/project/actions';

const useStyles = makeStyles({
  root: {
    height: '100%',
    position: 'relative',
  },
});

const FreeCanvas = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentRootId = useSelector(selectCurrentRootId);
  const elements = useSelector(selectDirectRootChildren);
  const activeElementId = useSelector(selectActiveElementId);

  return (
    <div
      className={classes.root}
      onClick={() => dispatch(setActiveElement(currentRootId))}
    >
      {Object.values(elements).map((element) => (
        <FreeDraggable
          key={element.id}
          element={element}
          isActive={element.id === activeElementId}
        />
      ))}
    </div>
  );
};

export default FreeCanvas;
