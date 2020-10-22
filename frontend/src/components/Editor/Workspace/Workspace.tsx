import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import EditorViewport from '../Viewport/Viewport';
import Scrollbar from '../../UI/Scrollbar';
import { resetScreenState } from '../../../redux/project/actions';
import { selectCurrentRootId } from '../../../redux/project/selectors';
import DraggableItem from '../Draggable/DraggableElement';
import ElementsInteractions from '../ElementsInteractions/ElementsInteractions';
import NNProcessingModal from '../../Dialogs/NNProcessing';
import {
  selectFreeCanvasMode,
  selectIsPrototypeMode,
} from '../../../redux/user/selectors';
import NewTopBar from '../TopBar';
import Example from '../FreeCanvas';
import { SCREEN_FORMATS } from '../../../constants/defaultParams';

// export const formats = ['desktop', 'tablet', 'mobile'] as const;

const useStyles = makeStyles({
  root: {
    padding: '1em',
    display: 'flex',
    flex: '1 1',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  editor: {
    backgroundColor: '#fff',
    border: '1px solid #e7eaec',
    borderTop: 'none',
    overflow: 'auto',
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
  const dispatch = useDispatch();

  const rootElementId = useSelector(selectCurrentRootId);
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);

  const [format, setFormat] = useState(SCREEN_FORMATS.Desktop);
  const [rotated, setRotated] = useState<boolean>(false);

  const classes = useStyles(rotated);

  const handleFormatChange = (ev, newFormat) => {
    if (!newFormat) return;
    setFormat(newFormat);
  };

  useEffect(
    () => () => {
      dispatch(resetScreenState());
    },
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <NewTopBar
        format={format}
        handleFormatChange={handleFormatChange}
        rotated={rotated}
        handleRotatedToggle={() => setRotated((prevState) => !prevState)}
      />

      <EditorViewport>
        <Scrollbar
          className={cn(classes.editor, classes[format])}
          autoHeightMin="100%"
        >
          {freeCanvasMode ? (
            <Example />
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
  );
};

export default Workspace;
