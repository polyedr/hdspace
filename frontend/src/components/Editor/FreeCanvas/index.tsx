import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop, XYCoord } from 'react-dnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectCurrentScreenId,
  selectDirectRootChildren,
} from '../../../redux/project/selectors';
import FreeDraggable from './FreeDraggable';
import {
  setActiveElement,
  updateElementParameters,
} from '../../../redux/project/actions';

const useStyles = makeStyles({
  root: {
    height: '100%',
    position: 'relative',
  },
});

const FreeCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const currentRootId = useSelector(selectCurrentRootId);
  const activeElementId = useSelector(selectActiveElementId);
  const elements = useSelector(selectDirectRootChildren);

  const moveFreeElement = (id: string, left: number, top: number) => {
    dispatch(
      updateElementParameters(
        id,
        {
          left,
          top,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const [, drop] = useDrop({
    accept: 'freeElement',
    drop(item: any, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);

      moveFreeElement(item.id, left, top);
      return undefined;
    },
  });

  return (
    <div
      ref={drop}
      className={classes.root}
      onClick={() => dispatch(setActiveElement(currentRootId))}
    >
      {Object.values(elements).map((element) => {
        return (
          <FreeDraggable
            key={element.id}
            element={element}
            isActive={element.id === activeElementId}
          />
        );
      })}
    </div>
  );
};

export default FreeCanvas;
