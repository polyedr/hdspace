import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useGlobalDropTarget from '@Utils/dragAndDrop/GlobalDropTarget/useGlobalDropTarget';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditorDocument } from '@Redux/project/selectors/base';
import { enqueueSnackbar } from '@Redux/notification/actions';
import useHotkeys from '../../../utils/useHotkeys';
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
  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const iframeDocument = useSelector(selectEditorDocument);

  useHotkeys(
    'control+meta+m+k',
    () =>
      dispatch(
        enqueueSnackbar({
          message: 'fire',
        }),
      ),
    iframeDocument as Document,
  );
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
