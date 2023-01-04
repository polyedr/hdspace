import ELEMENT_IDS from '@Constants/elementIds';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@mui/material';
import {
  copyActiveElement,
  pasteCopiedElement,
  pasteElementAtIndex,
} from '@Redux/project/actions';
import { selectShowingGrid } from '@Redux/project/selectors/base';
import {
  getIndexOfSelectedElementInParentChildren,
  selectActiveElement,
  selectDirectChildren,
  selectIsElementActive,
  selectItemToCopyInfo,
  selectParentOfActiveElement,
} from '@Redux/project/selectors/element';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { BoundingStyles, DropTargetParams, Entity } from '@Src/types';
import { canElementHaveChildren } from '@Utils/AvailableChildrenHelper';
import cn from 'classnames';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Rnd } from 'react-rnd';
import DropPositionMarker from './DropPositionMarker';

interface Props {
  elementId: string;
  type: string;
  styles: BoundingStyles;
  isActiveBorder: boolean;
  dropTargetParams: DropTargetParams | null;
  enableDropTargetBordersMode: boolean;
  updateStyles: (payload: React.CSSProperties) => void;
  keepAspectRatio: boolean | undefined;
}

const useStyles = makeStyles<Theme, { isActive: boolean }>({
  resizeHandle: {
    display: ({ isActive }) => (isActive ? 'block' : 'none'),
    width: '8px !important',
    height: '8px !important',
    backgroundColor: 'white',
    border: '1px #5A899D solid',
  },
  topHandle: {
    transform: 'translateX(-50%)',
    left: '50% !important',
    top: '-4px !important',
    cursor: 'ns-resize !important',
  },
  topRightHandle: {
    right: '-4px !important',
    top: '-4px !important',
  },
  rightHandle: {
    transform: 'translateY(-50%)',
    right: '-4px !important',
    top: '50% !important',
    cursor: 'ew-resize!important',
  },
  bottomRightHandle: {
    right: '-4px !important',
    bottom: '-4px !important',
  },
  bottomHandle: {
    bottom: '-4px !important',
    left: '50% !important',
    transform: 'translateX(-50%)',
    cursor: 'ns-resize !important',
  },
  bottomLeftHandle: {
    bottom: '-4px !important',
    left: '-4px !important',
  },
  leftHandle: {
    top: '50% !important',
    left: '-4px !important',
    transform: 'translateY(-50%)',
    cursor: 'ew-resize!important',
  },
  topLeftHandle: {
    left: '-4px !important',
    top: '-4px !important',
  },
});

const Borders: React.FC<Props> = ({
  elementId,
  type,
  styles,
  isActiveBorder,
  dropTargetParams,
  enableDropTargetBordersMode,
  updateStyles,
  keepAspectRatio,
}) => {
  const isDropTarget = dropTargetParams?.id === elementId;
  const isActive = useSelector(selectIsElementActive(elementId));
  const showGrid = useSelector(selectShowingGrid);
  const classes = useStyles({ isActive });
  const rightGridScale = useRef<HTMLDivElement>(null);
  const index = useSelector(getIndexOfSelectedElementInParentChildren);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const canHaveChildren = canElementHaveChildren(type as Entity);
  const emptyClipboard = !useSelector(selectItemToCopyInfo);
  const dispatch = useDispatch();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      const frame = window.parent.document.getElementById(
        ELEMENT_IDS.canvas,
      ) as HTMLIFrameElement;

      const { x, y } = frame.getBoundingClientRect();

      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + x,
              mouseY: event.clientY + y,
            }
          : null,
      );
    },
    [elementId],
  );

  const handleClose = () => {
    setContextMenu(null);
  };

  if (!elementId || !styles) {
    return null;
  }

  const { top, left, height, width } = styles;

  // eslint-disable-next-line no-unused-vars
  const onResize = (e, direction, ref, delta, position) => {
    const newWidth = { width: `${Math.trunc(ref.offsetWidth)}px` };
    const newHeight = { height: `${Math.trunc(ref.offsetHeight)}px` };
    updateStyles({
      ...newWidth,
      ...newHeight,
      flexGrow: 0,
    });
  };
  interface HandleStyles {
    bottom?: string;
    bottomLeft?: string;
    bottomRight?: string;
    left?: string;
    right?: string;
    top?: string;
    topLeft?: string;
    topRight?: string;
  }

  const resizeHandle: HandleStyles = {
    top: cn(classes.resizeHandle, classes.topHandle),
    topRight: cn(classes.resizeHandle, classes.topRightHandle),
    right: cn(classes.resizeHandle, classes.rightHandle),
    bottomRight: cn(classes.resizeHandle, classes.bottomRightHandle),
    bottom: cn(classes.resizeHandle, classes.bottomHandle),
    bottomLeft: cn(classes.resizeHandle, classes.bottomLeftHandle),
    left: cn(classes.resizeHandle, classes.leftHandle),
    topLeft: cn(classes.resizeHandle, classes.topLeftHandle),
  };
  if (type === 'navbar') {
    delete resizeHandle.topRight;
    delete resizeHandle.bottomRight;
    delete resizeHandle.bottomLeft;
    delete resizeHandle.topLeft;
    delete resizeHandle.left;
    delete resizeHandle.right;
  }
  if (type === 'carousel') {
    delete resizeHandle.top;
    delete resizeHandle.bottom;
    delete resizeHandle.left;
    delete resizeHandle.right;
  }

  const lockedAspectRatioElements: [string] = ['carousel'];
  const selectedElementType: string = type;

  const pasteToBoard = () => {
    dispatch(pasteCopiedElement({ screenId: currentScreenId }));
    handleClose();
  };

  const pasteAfterElement = () => {
    dispatch(pasteElementAtIndex({ index: index + 1 }));
  };

  const pasteBeforeElement = () => {
    dispatch(pasteElementAtIndex({ index }));
  };

  const copyToClipBoard = () => {
    dispatch(copyActiveElement());
    handleClose();
  };

  if (keepAspectRatio) {
    lockedAspectRatioElements.push(selectedElementType);
  }

  return (
    <>
      {!canHaveChildren && (
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={copyToClipBoard}>Copy</MenuItem>
          <MenuItem
            disabled={canHaveChildren || emptyClipboard}
            onClick={pasteAfterElement}
          >
            Paste After
          </MenuItem>
          <MenuItem
            disabled={canHaveChildren || emptyClipboard}
            onClick={pasteBeforeElement}
          >
            Paste Before
          </MenuItem>
        </Menu>
      )}
      {canHaveChildren && (
        <Menu
          open={contextMenu !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem onClick={copyToClipBoard}>Copy</MenuItem>
          <MenuItem
            disabled={!canHaveChildren || emptyClipboard}
            onClick={pasteToBoard}
          >
            Paste
          </MenuItem>
        </Menu>
      )}
      {isActiveBorder &&
        !showGrid &&
        !['root', 'calendar', 'clock'].includes(type) && (
          <div style={{ width }}>
            <div
              style={{
                left: 4 + left + width,
                top: top + height / 2,
                position: 'absolute',
                color: 'red',
                fontSize: 'x-small',
                fontWeight: 'bold',
              }}
            >
              {`${Math.trunc(height)} px`}
            </div>
            <div
              style={{
                marginTop: 4 + top + height,
                textAlign: 'center',
                color: 'red',
                fontSize: 'x-small',
                fontWeight: 'bold',
              }}
            >
              {`${Math.trunc(width)} px`}
            </div>
          </div>
        )}

      {isActiveBorder &&
        showGrid &&
        !['root', 'calendar', 'clock'].includes(type) && (
          <div>
            <div
              style={{
                borderTop: '1px solid red',
                left: 4 + left + width,
                width: `calc(100% - (${left}px + ${width}px))`,
                top: top + height / 2,
                position: 'absolute',
                textAlign: 'center',
                color: 'red',
                fontSize: 'x-small',
                fontWeight: 'bold',
              }}
              ref={rightGridScale}
            >
              {rightGridScale.current?.scrollWidth !== undefined
                ? `${Math.round(
                    // eslint-disable-next-line prettier/prettier
                  (Number(rightGridScale.current?.scrollWidth) * 100) / 100,
                  )}px`
                : null}
            </div>

            <div
              style={{
                borderLeft: '1px solid red',
                height: top,
                position: 'absolute',
                left: width / 2 + left,
              }}
            >
              <span
                style={{
                  color: 'red',
                  fontSize: 'x-small',
                  fontWeight: 'bold',
                  top: '50%',
                  position: 'absolute',
                }}
              >
                {`${Math.round((Number(top) * 100) / 100)}px`}
              </span>
            </div>
          </div>
        )}
      {!['root', 'calendar', 'clock'].includes(type) && (
        <Rnd
          position={{ x: left, y: top }}
          size={{ width, height }}
          style={{ border: '1px #5A899D solid' }}
          onResize={onResize}
          onResizeStop={onResize}
          disableDragging
          resizeHandleClasses={resizeHandle}
          lockAspectRatio={lockedAspectRatioElements.includes(type)}
          enableResizing={{
            bottom: true,
            bottomLeft: false,
            bottomRight: true,
            left: false,
            right: true,
            top: false,
            topLeft: false,
            topRight: true,
          }}
        >
          <div
            onContextMenu={handleContextMenu}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
          {enableDropTargetBordersMode && isDropTarget && (
            <DropPositionMarker styles={styles} isActive={isActiveBorder} />
          )}
        </Rnd>
      )}
    </>
  );
};

export default Borders;
