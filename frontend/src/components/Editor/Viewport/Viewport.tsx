// @ts-nocheck

import React, { useCallback, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';

import { createStyles } from '@material-ui/core';

import { setActiveElement } from '@Redux/project/actions';

import {
  selectActiveElementId,
  selectCurrentRootId,
} from '@Redux/project/selectors/element';

import useHotKeys from '../hooks/useHotKeys';

const useStyles = makeStyles(() =>
  createStyles({
    editorViewport: {
      position: 'relative',

      display: 'flex',

      flexGrow: 1,

      justifyContent: 'center',

      backgroundColor: '#cccccc',

      '&:focus': {
        outline: 0,
      },
    },
  }),
);

const Viewport: React.FC = ({ children }) => {
  const activeElementId = useSelector(selectActiveElementId);

  const rootID = useSelector(selectCurrentRootId);

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

    [dispatch, rootID, activeElementId],
  );

  return (
    <div
      ref={ref}
      className={styles.editorViewport}
      onMouseDown={handleRootClick}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export default Viewport;
