import React from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { StateElement } from '../../../redux/project/types';
import { setActiveElement } from '../../../redux/project/actions';

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
});

type Props = {
  element: StateElement;
  isActive: boolean;
};

const FreeElementRenderer = React.forwardRef<HTMLDivElement, Props>(
  ({ element: { id, name, parameters }, isActive }, ref) => {
    const { left = 0, top = 0 } = parameters;
    const dispatch = useDispatch();

    const classes = useStyles({
      left,
      top,
      isActive,
    });

    const handleClick = (ev) => {
      ev.stopPropagation();
      dispatch(setActiveElement(id));
    };

    return (
      <div ref={ref} onClick={handleClick} className={classes.root}>
        {name}
      </div>
    );
  },
);

export default FreeElementRenderer;
