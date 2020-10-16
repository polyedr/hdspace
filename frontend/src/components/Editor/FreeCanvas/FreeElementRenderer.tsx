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

// import ChildRenderer from './ChildRenderer';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    border: (props: any) => `1px solid ${props.isActive ? 'red' : 'black'}`,
    backgroundColor: '#fff',
    padding: '0.5rem 1rem',
    cursor: 'move',
    left: (props: any) => props.left,
    top: (props: any) => props.top,
  },
  div: {
    cursor: 'move',
    flex: 1,
  },
});

const getStyle = (props) => ({
  position: 'absolute' as const,
  border: `1px solid ${props.isActive ? 'red' : 'black'}`,
  backgroundColor: '#fff',
  padding: '0.5rem 1rem',
  left: props.left,
  top: props.top,
  display: 'flex',
  justifyContent: 'stretch',
  alignItems: 'stretch',
});

type Props = {
  element: StateElement;
  isActive: boolean;
};

const FreeElementRenderer = React.forwardRef<HTMLDivElement, Props>(
  ({ element: { id, parameters, name }, isActive }, ref) => {
    const { left = 0, top = 0, width = 300, height = 100 } = parameters;
    const classes = useStyles({ left, top, isActive });
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

    return (
      <Resizable
        size={{ height, width }}
        style={getStyle({ left, top, isActive })}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
        <div ref={ref} onClick={handleClick} className={classes.div}>
          {/* {children.map((childId) => (
          <ChildRenderer id={childId} key={childId} />
        ))} */}

          {name}
        </div>
      </Resizable>
    );
  },
);

export default FreeElementRenderer;
