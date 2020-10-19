import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Resizable } from 're-resizable';
import { StateElement } from '../../../redux/project/types';
import {
  setActiveElement,
  updateElementParameters,
} from '../../../redux/project/actions';
import { selectCurrentScreenId } from '../../../redux/project/selectors';

const useStyles = makeStyles({
  div: {
    cursor: 'move',
    flex: 1,
    border: (props: any) => `1px solid ${props.isActive ? 'red' : 'black'}`,
    opacity: (props: any) => (props.isDragging ? 0 : 1),
    backgroundColor: '#fff',
  },
});

const getStyle = (props) => ({
  position: 'absolute' as const,
  left: props.left,
  top: props.top,
  display: 'flex',
  justifyContent: 'stretch',
  alignItems: 'stretch',
});

type Props = {
  element: StateElement;
  isActive: boolean;
  isDragging: boolean;
};

const FreeElementRenderer = React.forwardRef<HTMLDivElement, Props>(
  ({ element: { id, parameters, name }, isActive, isDragging }, ref) => {
    const { left = 0, top = 0, width = 300, height = 100 } = parameters;

    const classes = useStyles({ left, top, isActive, isDragging });
    const dispatch = useDispatch();

    const currentScreenId = useSelector(selectCurrentScreenId);

    const handleClick = (ev) => {
      ev.stopPropagation();
      dispatch(setActiveElement(id));
    };

    const handleResizeStart = () => {
      dispatch(setActiveElement(id));
    };

    const handleResizeStop = (e, direction, ref, d) => {
      dispatch(
        updateElementParameters(
          id,
          {
            width: width + d.width,
            height: height + d.height,
          },
          { screenId: currentScreenId },
        ),
      );
    };

    const handleResize = (e, direction) => {
      console.log(direction);
    };

    return (
      <Resizable
        size={{ height, width }}
        style={getStyle({ left, top, isActive })}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        bounds="parent"
        onResize={handleResize}
      >
        <div ref={ref} onClick={handleClick} className={classes.div}>
          {name}
        </div>
      </Resizable>
    );
  },
);

export default FreeElementRenderer;
