import React, { useRef } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
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
  const styles = useStyles();

  const ref = useRef<HTMLDivElement>(null);

  useHotKeys(ref);

  return (
    <div ref={ref} className={styles.editorViewport} tabIndex={-1}>
      {children}
    </div>
  );
};

export default Viewport;
