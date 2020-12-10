import React, { useRef, useEffect } from 'react';
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
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import DraggableElement from '../Draggable/DraggableElement';
import ElementsInteractions from './ElementsInteractions/ElementsInteractions';
import NNProcessingModal from '../../Dialogs/NNProcessing';
import Scrollbar from '../../UI/Scrollbar';
import FreeCanvas from '../FreeCanvas';
import EditorViewport from '../Viewport/Viewport';
import { DOMHandler } from './DOMHandler';

const useStyles = makeStyles({
  workspace: {
    padding: '0.5em',
    flex: '1 1',
    flexDirection: 'column',
    overflow: 'auto',
    display: 'block',
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
  const currentScreenId = useSelector(selectCurrentScreenId);

  const classes = useStyles(rotated);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    DOMHandler.INSTANCE.reset();
  }, [currentScreenId]);

  useGlobalDropTarget(
    ['smartHeader', 'smartFooter', 'smartForm', 'smartWebpage'],
    ref,
  );

  return (
    <div className={classes.workspace} ref={ref}>
      <div className={classes.wrapper}>
        <EditorViewport>
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
                <DraggableElement elementId={rootElementId} />
                {!isPrototypeMode && <ElementsInteractions />}
              </>
            )}
          </Scrollbar>
        </EditorViewport>
        <NNProcessingModal />
      </div>
    </div>
  );
};

export default Workspace;
