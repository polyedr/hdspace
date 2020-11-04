import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import makeStyles from '@material-ui/core/styles/makeStyles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { StateElement } from '../../../redux/project/types';
import {
  setActiveElement,
  updateElementParameters,
} from '../../../redux/project/actions';
import { selectCurrentScreenId } from '../../../redux/project/selectors';
import { splitWords } from '../../../utils/StringHelper';

const useStyles = makeStyles({
  rnd: {
    position: 'absolute',
    border: (props: any) =>
      `1px solid ${props.isActive ? '#5A899D' : 'transparent'}`,
    overflow: 'hidden',
    '&:hover': {
      border: (props: any) =>
        `1px solid ${props.isActive ? '#5A899D' : '#7a7a7a'}`,
    },
    '&:hover > $crumb': {
      display: 'flex',
    },
    zIndex: ({ isActive, zIndex, includesActiveElement }: any) =>
      isActive || includesActiveElement ? 1000 : zIndex,
  },
  crumb: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    color: 'white',
    display: 'none',
    fontSize: '.8em',
    textTransform: 'capitalize',
  },
  general: {
    backgroundColor: (props: any) => (props.isActive ? '#5A899D' : '#7a7a7a'),
    display: 'flex',
    flexWrap: 'nowrap',
    height: 16,
    borderBottom: '1px solid #bbb',
  },
  name: {
    padding: '0 0.5em',
  },
  iconButton: {
    height: 16,
    width: 16,
    padding: 0,
    fontSize: 16,
    color: '#fff',
    borderRadius: 0,
  },
  divider: {
    backgroundColor: '#bbb',
  },
});

type Props = {
  element: StateElement;
  isActive: boolean;
  includesActiveElement?: boolean;
  lockAspectRatio?: boolean;
};

const FreeDraggable: React.FC<Props> = ({
  element,
  isActive,
  includesActiveElement,
  lockAspectRatio,
  children,
}) => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const {
    id,
    name,
    parameters: { left, top, width, height, zIndex = 0 },
  } = element;
  const classes = useStyles({ isActive, zIndex, includesActiveElement });

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

  const handleInteractionStart = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElement(id));
  };

  const handleResizeStop: RndResizeCallback = (
    e,
    dir,
    ref,
    delta,
    position,
  ) => {
    if (
      width === ref.style.width &&
      height === ref.style.height &&
      left === position.x &&
      top === position.y
    ) {
      return;
    }

    dispatch(
      updateElementParameters(
        id,
        {
          width: ref.style.width,
          height: ref.style.height,
          left: position.x,
          top: position.y,
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const handleDragStop: RndDragCallback = (e, { x, y }) => {
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
      onClick={handleInteractionStart}
      className={classes.rnd}
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      position={{
        x: left,
        y: top,
      }}
      size={
        width &&
        height && {
          width,
          height,
        }
      }
      onResizeStart={handleInteractionStart}
      onDragStart={handleInteractionStart}
      lockAspectRatio={lockAspectRatio}
    >
      {children}

      <div className={classes.crumb}>
        <div className={classes.general}>
          <span className={classes.name}>{splitWords(name)}</span>

          <Divider orientation="vertical" className={classes.divider} />

          <IconButton
            onClick={() => setOpen((prevOpen) => !prevOpen)}
            className={classes.iconButton}
            title="Settings"
          >
            <SettingsIcon fontSize="inherit" />
          </IconButton>
        </div>

        <div hidden={!open} role="menu">
          <div className={classes.general}>
            <span className={classes.name}>
              Z-index:
              <b>{` ${zIndex}`}</b>
            </span>

            <Divider orientation="vertical" className={classes.divider} />

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
        </div>
      </div>
    </Rnd>
  );
};

export default FreeDraggable;
