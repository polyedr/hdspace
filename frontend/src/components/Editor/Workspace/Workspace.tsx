import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import EditorViewport from '../Viewport/Viewport';
import Scrollbar from '../../UI/Scrollbar';
import {
  selectCurrentRootId,
  selectFreeCanvasMode,
  selectScreenFormat,
  selectScreenRotated,
} from '../../../redux/project/selectors';
import DraggableItem from '../Draggable/DraggableElement';
import ElementsInteractions from '../ElementsInteractions/ElementsInteractions';
import NNProcessingModal from '../../Dialogs/NNProcessing';
import useGlobalDropTarget from '../../../utils/dragAndDrop/GlobalDropTarget/useGlobalDropTarget';
import { selectIsPrototypeMode } from '../../../redux/user/selectors';
import FreeCanvas from '../FreeCanvas';

const useStyles = makeStyles({
  workspace: {
    padding: '1em',
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

  const classes = useStyles(rotated);

  const ref = useRef<HTMLDivElement | null>(null);

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
                <DraggableItem elementId={rootElementId} />
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
