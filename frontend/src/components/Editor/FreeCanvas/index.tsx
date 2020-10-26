import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveElementId,
  selectCurrentRootId,
  selectDirectRootChildren,
} from '../../../redux/project/selectors';
import { setActiveElement } from '../../../redux/project/actions';
import FREE_CANVAS_RENDERERS from './FreeRenderers';

const useStyles = makeStyles({
  freeCanvas: {
    height: '100%',
    position: 'relative',
    userSelect: 'none',
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
      className={classes.freeCanvas}
      onClick={() => dispatch(setActiveElement(currentRootId))}
    >
      {Object.values(elements).map((element) => {
        const Renderer = FREE_CANVAS_RENDERERS[element.type];
        if (!Renderer) return null;

        return (
          <Renderer
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
