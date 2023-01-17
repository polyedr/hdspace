import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';
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
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
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
    zIndex: ({
      isActive,
      zIndex,
      includesActiveElement,
    }: FreeDraggableStylesProps) =>
      isActive || includesActiveElement ? 1000 : zIndex,
  },
  imageView: {
    position: 'absolute',
    width: 'auto !important',
    height: 'auto !important',
    zIndex: ({
      isActive,
      zIndex,
      includesActiveElement,
    }: FreeDraggableStylesProps) =>
      isActive || includesActiveElement ? 1000 : zIndex,
  },
  resizeHande: {
    borderRadius: '4px',
    zIndex: 1000,
    '&:hover': {
      backgroundColor: 'rgba(136, 136, 136, 0.5)',
    },
  },
  activeResizeHandle: {
    backgroundColor: 'rgba(136, 136, 136, 0.5)',
  },
});

interface Props {
  elementId: StateElement['id'];
  includesActiveElement?: boolean;
  lockAspectRatio?: boolean;
}

const FreeDraggable: React.FC<Props> = ({ elementId }) => {
  const dispatch = useDispatch();
  const disableInteractions = useSelector(selectIsPrototypeMode);

  const element = useSelector(selectElementByIdWrapper(elementId));
  const includesActiveElement = useSelector(
    selectIncludesActiveElement(elementId),
  );
  const isActive = useSelector(selectIsElementActive(elementId));

  const {
    id,
    parameters: {
      freeCanvas: { left = 0, top = 0, width = 0, height = 0, zIndex = 0 } = {},
      keepAspectRatio,
    },
    type,
  } = element;

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
    e,
    dir,
    ref,
    delta,
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
          width: ref.style.width,
          height: ref.style.height,
        },
        { screenId: currentScreenId },
      ),
    );
    setResizeDir(false);
  };

  const handleDragStop: RndDragCallback = (e, { x, y, node }) => {
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
  };

  const Renderer = RENDERERS[type as Entity];

  const activeHandle = (dir: string) =>
    resizeDir === dir && classes.activeResizeHandle;

  const renderElement = () => (
    <Renderer element={element} isDisabled={!disableInteractions}>
      {element.children.map((childId) => (
        <FreeDraggable key={childId} elementId={childId} />
      ))}
    </Renderer>
  );

  return notDraggableElements.includes(type as Entity) ? (
    renderElement()
  ) : (
    <Rnd
      onClick={handleInteractionStart}
      className={element.type === 'image' ? classes.imageView : classes.rnd}
      onResizeStop={handleResizeStop}
      onDragStop={handleDragStop}
      position={{
        x: left,
        y: top,
      }}
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
        bottom: cn(classes.resizeHande, activeHandle('bottom')),
        bottomLeft: cn(classes.resizeHande, activeHandle('bottomLeft')),
        bottomRight: cn(classes.resizeHande, activeHandle('bottomRight')),
        left: cn(classes.resizeHande, activeHandle('left')),
        top: cn(classes.resizeHande, activeHandle('top')),
        right: cn(classes.resizeHande, activeHandle('right')),
        topLeft: cn(classes.resizeHande, activeHandle('topLeft')),
        topRight: cn(classes.resizeHande, activeHandle('topRight')),
      }}
      disableDragging={disableInteractions}
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
        <Borders element={element} hover={hover} isActive={isActive} />
      ) : null}
    </Rnd>
  );
};

export default FreeDraggable;
