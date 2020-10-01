/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React, { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import { setActiveElement } from '../../../redux/project/actions';
import {
  selectActiveElementId,
  selectCurrentRootId,
} from '../../../redux/project/selectors';
import useHotKeys from '../hooks/useHotKeys';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';

const useStyles = makeStyles(() =>
  createStyles({
    editorViewport: {
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
      height: '100%',
      minHeight: 0,
      backgroundColor: '#cccccc',
      '&:focus': {
        outline: 0,
      },
    },
  }),
);

const Viewport: React.FC<{ children: any | any[] }> = ({ children }) => {
  const activeElementId = useSelector(selectActiveElementId);
  const rootID = useSelector(selectCurrentRootId);
  const isDisabled = useSelector(selectIsPrototypeMode);

  const dispatch = useDispatch();
  const styles = useStyles();

  const ref = useRef<HTMLElement>() as React.MutableRefObject<HTMLElement>;

  useHotKeys(ref);

  const handleRootClick = useCallback(
    (event: React.MouseEvent) => {
      const target = (event.nativeEvent.target as HTMLElement)?.closest(
        '[data-ls-id]',
      ) as HTMLElement;
      if (!target) return;

      const elementId = target.dataset.lsId;

      if (elementId === activeElementId) return;

      if (elementId) {
        dispatch(setActiveElement(elementId === 'root' ? rootID : elementId));
      }
    },
    [rootID, activeElementId],
  );
  return (
    <div
      ref={ref}
      className={styles.editorViewport}
      onMouseDown={handleRootClick}
      tabIndex={isDisabled ? 0 : -1}
    >
      {children}
    </div>
  );
};

export default Viewport;
