import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { selectCurrentRootId } from '@Redux/project/selectors/element';
import {
  selectScreenFormat,
  selectScreenRotated,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/base';
import useGlobalDropTarget from '@Utils/dragAndDrop/GlobalDropTarget/useGlobalDropTarget';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import DraggableItem from '../Draggable/DraggableElement';
import ElementsInteractions from '../ElementsInteractions/ElementsInteractions';
import NNProcessingModal from '../../Dialogs/NNProcessing';
import Scrollbar from '../../UI/Scrollbar';
import FreeCanvas from '../FreeCanvas';
import useHotKeys from '../hooks/useHotKeys';

const useStyles = makeStyles({
  workspace: {
    padding: '1em',
    flex: '1 1',
    flexDirection: 'column',
    overflow: 'auto',
    display: 'block',
  },
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
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  editor: {
    backgroundColor: '#fff',
    border: '1px solid #e7eaec',
    borderTop: 'none',
    overflow: 'hidden',
  },
  desktop: {
    flexBasis: '100%',
    minWidth: '100%',
  },
  tablet: {
    flexBasis: (rotated) => (rotated ? 1024 : 768),
  },
  mobile: {
    flexBasis: (rotated) => (rotated ? 568 : 320),
  },
});

const Workspace: React.FC = () => {
  const rootElementId = useSelector(selectCurrentRootId);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);
  const format = useSelector(selectScreenFormat);
  const rotated = useSelector(selectScreenRotated);

  const classes = useStyles(rotated);

  const ref = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useGlobalDropTarget(
    ['smartHeader', 'smartFooter', 'smartForm', 'smartWebpage'],
    ref,
  );

  useHotKeys(editorRef);

  return (
    <div className={classes.workspace} ref={ref}>
      <div className={classes.wrapper}>
        <div className={classes.editorViewport} ref={editorRef}>
          <Scrollbar
            className={cn(classes.editor, classes[format])}
            autoHeightMin="100%"
            autoHeightMax={
              ref.current
                ? `calc(${ref.current.getBoundingClientRect().height}px - 2em)`
                : '100%'
            }
          >
            {freeCanvasMode ? (
              <FreeCanvas />
            ) : (
              <>
                <DraggableItem elementId={rootElementId} />
                {!isPrototypeMode && <ElementsInteractions />}
              </>
            )}
          </Scrollbar>
        </div>

        <NNProcessingModal />
      </div>
    </div>
  );
};

export default Workspace;
