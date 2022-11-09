import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useGlobalDropTarget from '@Utils/dragAndDrop/GlobalDropTarget/useGlobalDropTarget';
import 'css-ripple-effect/dist/ripple.min.css';
import useViewportHotkeys from '../hooks/useViewportHotkeys';

const useStyles = makeStyles(() =>
  createStyles({
    editorViewport: {
      // height: '100vh',
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

  useViewportHotkeys();

  useGlobalDropTarget(
    ['smartHeader', 'smartFooter', 'smartForm', 'smartWebpage', 'image'],
    ref,
  );

  return (
    <div ref={ref} className={styles.editorViewport} tabIndex={-1}>
      {children}
    </div>
  );
};

export default Viewport;
