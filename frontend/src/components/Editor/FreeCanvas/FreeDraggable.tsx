import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import cn from 'classnames';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import { StateElement } from '../../../redux/project/types';
import {
  setActiveElement,
  updateElementParameters,
} from '../../../redux/project/actions';
import {
  selectCurrentScreenId,
  selectProjectClasses,
} from '../../../redux/project/selectors';
import { splitWords } from '../../../utils/StringHelper';

const useElementClassNames = (element: StateElement) => {
  const projectClasses = useSelector(selectProjectClasses);

  const [entityClass, groupClass] = element.styles.classNames;
  const entityStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === entityClass)
      ?.rules || {};
  const groupStyles =
    projectClasses?.find((cssClass: any) => cssClass.className === groupClass)
      ?.rules || {};

  return makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...element.styles.ownStyles,
    },
  })();
};

const useStyles = makeStyles({
  rnd: {
    position: 'absolute',
    border: (props: any) =>
      `1px solid ${props.isActive ? 'red' : 'transparent'}`,
    overflow: 'hidden',
    '&:hover': {
      border: (props: any) => `1px solid ${props.isActive ? 'red' : '#7a7a7a'}`,
    },
    '&:hover > $crumb': {
      display: 'flex',
    },
    zIndex: ({ isActive, zIndex }: any) => (isActive ? 1000 : zIndex),
  },
  crumb: {
    flexWrap: 'nowrap',
    height: 16,
    backgroundColor: (props: any) => (props.isActive ? 'red' : '#7a7a7a'),
    position: 'absolute',
    top: 0,
    left: 0,
    color: 'white',
    display: 'none',
    fontSize: '.8em',
    padding: '0 0.5em',
    textTransform: 'capitalize',
  },
  iconButton: {
    height: 16,
    width: 16,
    padding: 0,
    fontSize: 16,
    color: '#fff',
  },
});

type Props = {
  element: StateElement;
  isActive: boolean;
};

const FreeDraggable: React.FC<Props> = ({ element, isActive, children }) => {
  const dispatch = useDispatch();

  const {
    id,
    name,
    parameters: { left, top, width, height, zIndex = 0 },
  } = element;
  const classes = useStyles({ isActive, zIndex });

  const { entityStyles, groupStyles, ownStyles } = useElementClassNames(
    element,
  );

  const currentScreenId = useSelector(selectCurrentScreenId);

  const moveUp = () => {
    dispatch(
      updateElementParameters(
        id,
        { zIndex: zIndex + 1 },
        { screenId: currentScreenId },
      ),
    );
  };

  const moveDown = () => {
    const newIndex = zIndex ? zIndex - 1 : zIndex;
    dispatch(
      updateElementParameters(
        id,
        { zIndex: newIndex },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleClick = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElement(id));
  };

  const handleInteractionStart = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElement(id));
  };

  const handleResizeStop = (e, dir, ref, delta, position) => {
    const resultWidth = width + delta.width;
    const resultHeight = height + delta.height;

    if (
      width === resultWidth &&
      height === resultHeight &&
      left === position.x &&
      top === position.y
    ) {
      return;
    }

    dispatch(
      updateElementParameters(
        id,
        {
          width: resultWidth,
          height: resultHeight,
          left: position.x,
          top: position.y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleDragStop = (e, { x, y }) => {
    if (x === left && y === top) return;

    dispatch(
      updateElementParameters(
        id,
        {
          left: x,
          top: y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <Rnd
      onClick={handleClick}
      className={classes.rnd}
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      bounds="parent"
      position={{
        x: left,
        y: top,
      }}
      size={{
        width,
        height,
      }}
      onResizeStart={handleInteractionStart}
      onDragStart={handleInteractionStart}
    >
      <div
        className={cn(entityStyles, groupStyles, ownStyles)}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>

      <div className={classes.crumb}>
        <span>{splitWords(name)}</span>

        <IconButton
          onClick={moveUp}
          className={classes.iconButton}
          title="Move element up"
        >
          <KeyboardArrowUpIcon fontSize="inherit" />
        </IconButton>

        <IconButton
          onClick={moveDown}
          className={classes.iconButton}
          title="Move element down"
          disabled={zIndex <= 0}
        >
          <KeyboardArrowDownIcon fontSize="inherit" />
        </IconButton>
      </div>
    </Rnd>
  );
};

export default FreeDraggable;
