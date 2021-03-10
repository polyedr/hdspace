import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  selectLayout,
  selectScreenRotated,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/base';
import useGlobalDropTarget from '@Utils/dragAndDrop/GlobalDropTarget/useGlobalDropTarget';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  selectCurrentScreenId,
  selectMasterScreenEnabled,
} from '@Redux/project/selectors/screen';
import { setActiveElement } from '@Redux/project/actions';
import { FrameWrapper } from '@Components/Editor/FrameWrapper';
import MasterScreen from '@Components/Editor/MasterScreen';
import Screen from '@Components/Editor/Screen';
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
    border: '1px solid #e7eaec',
    borderTop: 'none',
    overflow: 'hidden',
  },
  frameWrapper: {
    flexGrow: 1,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#cccccc',
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

type Props = {
  elementId?: string;
};

const Workspace: React.FC<Props> = ({ elementId }) => {
  const dispatch = useDispatch();
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);
  const format = useSelector(selectLayout);
  const rotated = useSelector(selectScreenRotated);
  const currentScreenId = useSelector(selectCurrentScreenId);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);

  const classes = useStyles(rotated);
  const ref = useRef<HTMLDivElement | null>(null);

  const [scrollLeft, setScrollLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!masterScreenEnabled) {
      DOMHandler.INSTANCE.reset();
    }
  }, [currentScreenId, masterScreenEnabled]);

  useGlobalDropTarget(
    ['smartHeader', 'smartFooter', 'smartForm', 'smartWebpage'],
    ref,
  );

  return (
    <div className={classes.workspace} ref={ref}>
      <div className={classes.wrapper}>
        <div className={classes.frameWrapper}>
          <FrameWrapper className={cn(classes[format])}>
            <EditorViewport>
              <Scrollbar
                ref={() => {
                  if (elementId) {
                    dispatch(setActiveElement(elementId));
                  }
                }}
                autoHeightMin="100%"
                autoHeightMax={
                  ref.current
                    ? `calc(${
                        ref.current.getBoundingClientRect().height
                      }px - 2em)`
                    : '100%'
                }
                onScroll={({ srcElement }) => {
                  setScrollLeft(srcElement.scrollLeft);
                }}
              >
                {freeCanvasMode ? (
                  <FreeCanvas />
                ) : (
                  <>
                    {masterScreenEnabled ? <MasterScreen /> : <Screen />}
                    {!freeCanvasMode && !isPrototypeMode && (
                      <ElementsInteractions posRight={scrollLeft} />
                    )}
                  </>
                )}
              </Scrollbar>
            </EditorViewport>

            <NNProcessingModal />
          </FrameWrapper>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
