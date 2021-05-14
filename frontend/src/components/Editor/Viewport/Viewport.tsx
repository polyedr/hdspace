import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useHotKeys from '../hooks/useHotKeys';

import 'css-ripple-effect/dist/ripple.min.css';

const useStyles = makeStyles(() =>
  createStyles({
    editorViewport: {
      position: 'relative',
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'center',
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
