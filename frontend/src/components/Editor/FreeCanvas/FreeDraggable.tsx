import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
import cn from 'classnames';
import { makeStyles } from '@mui/styles';
import { HotKeys } from 'react-hotkeys';
import {
  setActiveElement,
  updateElementParameters,
  updateElementStyles,
} from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { Entity, StateElement, FreeDraggableStylesProps } from '@Src/types';
import RENDERERS from '@Components/UI/RenderElements';
import {
  selectElementByIdWrapper,
  selectIncludesActiveElement,
  selectIsElementActive,
} from '@Redux/project/selectors/element';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import Borders from './Borders';

const notDraggableElements: Entity[] = [
  'option',
  'listItem',
  'dropdownItem',
  'dropdownMenu',
  'paginationItem',
  'breadcrumbItem',
  'navbarItem',
];

const useStyles = makeStyles({
  rnd: {
    position: 'absolute',
    cursor: 'default !important',
    zIndex: ({
      isActive,
      zIndex,
      includesActiveElement,
    }: FreeDraggableStylesProps) =>
      isActive || includesActiveElement ? 1000 : zIndex,
  },
  imageView: {
    position: 'absolute',
    width: 'auto',
    height: 'auto',
    cursor: 'default !important',
    zIndex: ({
      isActive,
      zIndex,
      includesActiveElement,
    }: FreeDraggableStylesProps) =>
      isActive || includesActiveElement ? 1000 : zIndex,
  },
  resizeHande: {
    // borderRadius: '4px',
    zIndex: 1000,
    // '&:hover': {
    //   backgroundColor: 'rgba(136, 136, 136, 0.5)',
    // },
  },
  activeResizeHandle: {
    // backgroundColor: 'rgba(136, 136, 136, 0.5)',
  },
  resizeHandeSquare: {
    // border: '1px solid #1CC09F',
    borderWidth: 1,
    borderStyle: 'solid',
    // borderColor: '#128A72',
    borderColor: (props: any) => (props.isActive ? '#128A72' : 'transparent'),
    height: '8px !important',
    width: '8px !important',
    backgroundColor: (props: any) => (props.isActive ? '#fff' : 'transparent'),
  },
  resizeBottomHande: {
    bottom: '-4px !important',
  },
  resizeLeftHande: {
    left: '-4px !important',
    // cursor: 'url(../../../assets/images/cursor_diagonal.svg)',
  },
  resizeTopHande: {
    top: '-4px !important',
  },
  resizeRightHande: {
    right: '-4px !important',
  },
  // eResizeCursor: {
  //   cursor: 'e-resize !important',
  // },
  // nResizeCursor: {
  //   cursor: 'n-resize !important',
  // },
  resizeBottomLeftHande: {
    cursor:
      'url(../../../../src/assets/images/cursor_diagonal.svg) 15 15, auto !important',
  },
  ResizeTopBottomCursor: {
    cursor:
      'url(../../../../src/assets/images/cursor_top.svg) 4 12, auto !important',
  },
  resizeLeftRightHande: {
    cursor:
      'url(../../../../src/assets/images/cursor_left_right.svg) 15 10, auto !important',
  },
  resizeBottomRightHande: {
    cursor:
      'url(../../../../src/assets/images/cursor_rotate.svg) 5 5, auto !important',
  },
  resizeTopLeftHande: {
    cursor:
      'url(../../../../src/assets/images/cursor_diagonal_left.svg) 15 15, auto !important',
  },
});

interface Props {
  elementId: StateElement['id'];
  includesActiveElement?: boolean;
  lockAspectRatio?: boolean;
  disabled?: boolean;
}

const FreeDraggable: React.FC<Props> = ({ elementId, disabled = false }) => {
  const dispatch = useDispatch();
  const disableInteractions = useSelector(selectIsPrototypeMode);

  const element = useSelector(selectElementByIdWrapper(elementId));
  const includesActiveElement = useSelector(
    selectIncludesActiveElement(elementId),
  );
  const isActive = useSelector(selectIsElementActive(elementId));

  const rndRef = useRef<Rnd>(null);

  const longPressIntervalRef = useRef(null);
  const longPressTimeoutRef = useRef(null);

  const {
    id,
    parameters: {
      freeCanvas: { left = 0, top = 0, width = 0, height = 0, zIndex = 0 } = {},
      keepAspectRatio,
    },
    type,
  } = element;

  const [position, setPosition] = useState({ x: left, y: top });

  const lockedAspectRatioElements: [string] = ['radiobutton'];
  const selectedElementType: string = type;
  if (keepAspectRatio) {
    lockedAspectRatioElements.push(selectedElementType);
  }

  const [resizeDir, setResizeDir] = useState<any>(false);
  const classes = useStyles({
    isActive,
    zIndex,
    includesActiveElement,
  });

  const currentScreenId = useSelector(selectCurrentScreenId);

  const [hover, setHover] = useState(false);

  const handleInteractionStart = (ev) => {
    ev.stopPropagation();
    dispatch(setActiveElement(id));
  };

  const handleResizeStop: RndResizeCallback = (
    _e,
    _dir,
    ref,
    _delta,
    position,
  ) => {
    if (
      width === parseInt(ref.style.width) &&
      height === parseInt(ref.style.height) &&
      left === position.x &&
      top === position.y
    ) {
      return;
    }

    dispatch(
      updateElementParameters(
        id,
        {
          ...element.parameters,
          freeCanvas: {
            zIndex,
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
            // width: parseInt(ref.style.width),
            // height: parseInt(ref.style.height),
            left: position.x,
            top: position.y,
          },
        },
        { screenId: currentScreenId },
      ),
    );
    dispatch(
      updateElementStyles(
        id,
        {
          // width: ref.style.width,
          // height: ref.style.height,
          width: '100%',
          height: '100%',
        },
        { screenId: currentScreenId },
      ),
    );
    setResizeDir(false);
  };

  const handleDragStop: RndDragCallback = (_, { x, y, node }) => {
    if (x === left && y === top) return;
    const { width, height } = node.getBoundingClientRect();

    dispatch(
      updateElementParameters(
        id,
        {
          ...element.parameters,
          freeCanvas: {
            zIndex,
            width,
            height,
            left: x,
            top: y,
          },
        },
        { screenId: currentScreenId },
      ),
    );

    setPosition({ x, y });
  };

  const Renderer = RENDERERS[type as Entity];

  const activeHandle = (dir: string) =>
    resizeDir === dir && classes.activeResizeHandle;

  const renderElement = () => (
    <Renderer element={element} isDisabled={!disableInteractions}>
      {element.children.map((childId) => (
        <FreeDraggable disabled={disabled} key={childId} elementId={childId} />
      ))}
    </Renderer>
  );

  const handleCancelTimer = () => {
    if (longPressIntervalRef.current) {
      clearInterval(longPressIntervalRef.current);
      longPressIntervalRef.current = null;
    }

    if (longPressTimeoutRef.current) {
      clearInterval(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }

    // update position in db
    if (left !== position.x || top !== position.y) {
      dispatch(
        updateElementParameters(
          id,
          {
            ...element.parameters,
            freeCanvas: {
              zIndex,
              width,
              height,
              left: position.x,
              top: position.y,
            },
          },
          { screenId: currentScreenId },
        ),
      );
    }
  };

  const longKeyHandler = (fn: () => void) => {
    fn();

    longPressTimeoutRef.current = setTimeout(() => {
      longPressIntervalRef.current = setInterval(fn, 10);
    }, 500);
  };

  const handlers = {
    MOVE_UP: (e: KeyboardEvent) => {
      e.preventDefault();
      longKeyHandler(() => {
        setPosition((position) => ({
          x: position.x,
          y: position.y - 1,
        }));
      });
    },
    MOVE_DOWN: (e: KeyboardEvent) => {
      e.preventDefault();
      longKeyHandler(() => {
        setPosition((position) => ({
          x: position.x,
          y: position.y + 1,
        }));
      });
    },
    MOVE_LEFT: (e: KeyboardEvent) => {
      e.preventDefault();
      longKeyHandler(() => {
        setPosition((position) => ({
          x: position.x - 1,
          y: position.y,
        }));
      });
    },
    MOVE_RIGHT: (e: KeyboardEvent) => {
      e.preventDefault();
      longKeyHandler(() => {
        setPosition((position) => ({
          x: position.x + 1,
          y: position.y,
        }));
      });
    },
  };

  return notDraggableElements.includes(type as Entity) ? (
    renderElement()
  ) : (
    <HotKeys handlers={handlers} onKeyUp={handleCancelTimer}>
      <Rnd
        data-testid={elementId}
        ref={rndRef}
        onClick={handleInteractionStart}
        className={element.type === 'image' ? classes.imageView : classes.rnd}
        onResizeStop={handleResizeStop}
        onDragStop={handleDragStop}
        position={position}
        {...(width &&
          height && {
            size: {
              width,
              height,
            },
          })}
        onResizeStart={(ev, dir) => {
          handleInteractionStart(ev);
          setResizeDir(dir);
        }}
        onDragStart={handleInteractionStart}
        lockAspectRatio={lockedAspectRatioElements.includes(type as Entity)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        resizeHandleClasses={{
          bottom: cn(
            classes.resizeHande,
            // classes.nResizeCursor,
            classes.ResizeTopBottomCursor,
            activeHandle('bottom'),
          ),
          bottomLeft: cn(
            classes.resizeHande,
            classes.resizeHandeSquare,
            classes.resizeBottomHande,
            classes.resizeLeftHande,
            classes.resizeBottomLeftHande,
            activeHandle('bottomLeft'),
          ),
          bottomRight: cn(
            classes.resizeHande,
            classes.resizeHandeSquare,
            classes.resizeBottomHande,
            classes.resizeRightHande,
            classes.resizeBottomRightHande,
            activeHandle('bottomRight'),
          ),
          left: cn(
            classes.resizeHande,
            classes.resizeLeftRightHande,
            // classes.eResizeCursor,
            activeHandle('left'),
          ),
          top: cn(
            classes.resizeHande,
            // classes.nResizeCursor,
            classes.ResizeTopBottomCursor,
            activeHandle('top'),
          ),
          right: cn(
            classes.resizeHande,
            classes.resizeLeftRightHande,
            // classes.eResizeCursor,
            activeHandle('right'),
          ),
          topLeft: cn(
            classes.resizeHande,
            classes.resizeHandeSquare,
            classes.resizeTopHande,
            classes.resizeLeftHande,
            classes.resizeTopLeftHande,
            activeHandle('topLeft'),
          ),
          topRight: cn(
            classes.resizeHande,
            classes.resizeHandeSquare,
            classes.resizeTopHande,
            classes.resizeRightHande,
            classes.resizeBottomLeftHande,
            activeHandle('topRight'),
          ),
        }}
        disableDragging={disableInteractions || disabled}
        enableResizing={{
          bottom: !disableInteractions,
          bottomLeft: !disableInteractions,
          bottomRight: !disableInteractions,
          left: !disableInteractions,
          top: !disableInteractions,
          right: !disableInteractions,
          topLeft: !disableInteractions,
          topRight: !disableInteractions,
        }}
      >
        {renderElement()}

        {!disableInteractions ? (
          // <Borders element={element} hidden={!hover && !isActive} />
          <Borders element={element} hover={hover} isActive={isActive} />
        ) : null}
      </Rnd>
    </HotKeys>
  );
};

export default FreeDraggable;
