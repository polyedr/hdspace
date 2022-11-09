import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectLayout,
  selectScreenRotated,
} from '@Redux/project/selectors/base';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  selectMasterScreenEnabled,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/screen';
import { FrameWrapper } from '@Components/Editor/FrameWrapper';
import MasterScreen from '@Components/Editor/MasterScreen';
import TreeCanvas from '@Components/Editor/TreeCanvas';
import Scrollbars from 'react-custom-scrollbars';
import { makeStyles } from '@material-ui/core/styles';
import ELEMENT_IDS from '@Constants/elementIds';
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
  motoG4: {
    flexBasis: (rotated) => (rotated ? 640 : 360),
  },
  pixel2: {
    flexBasis: (rotated) => (rotated ? 731 : 411),
  },
  iphone5: {
    flexBasis: (rotated) => (rotated ? 568 : 320),
  },
  iphone678: {
    flexBasis: (rotated) => (rotated ? 667 : 375),
  },
  iphone678Plus: {
    flexBasis: (rotated) => (rotated ? 736 : 414),
  },
  iphoneX: {
    flexBasis: (rotated) => (rotated ? 812 : 375),
  },
  ipad: {
    flexBasis: (rotated) => (rotated ? 768 : 1024),
  },
  ipadPro: {
    flexBasis: (rotated) => (rotated ? 1024 : 1366),
  },
});

type Props = {
  elementId?: string;
};

const Workspace: React.FC<Props> = () => {
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);

  const [scrollbarRef, setScrollbarRef] = useState<Scrollbars | null>(null);

  const format = useSelector(selectLayout);
  const rotated = useSelector(selectScreenRotated);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);

  const classes = useStyles(rotated);
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<Scrollbars | null>(null);

  const [scrollLeft, setScrollLeft] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (scrollbarRef && params.has('moveToElement')) {
      const canvas = document.getElementById(
        ELEMENT_IDS.canvas,
      ) as HTMLIFrameElement;

      canvas.onload = () => {
        const innerDoc =
          canvas.contentDocument || canvas.contentWindow?.document;
        const element = innerDoc?.getElementById(
          params.get('moveToElement') || '',
        );

        if (element) {
          element?.scrollIntoView({
            block: 'center',
            inline: 'nearest',
            behavior: 'smooth',
          });
        }
      };
    }
  }, [scrollbarRef]);

  return (
    <div className={classes.workspace} ref={ref}>
      <div className={classes.wrapper}>
        <div className={classes.frameWrapper}>
          <FrameWrapper className={classes[format]}>
            <EditorViewport>
              <Scrollbar
                ref={(scrollbars: any) => {
                  if (!scrollbars) {
                    return;
                  }
                  setScrollbarRef(scrollbars);
                  scrollRef.current = scrollbars;
                  DOMHandler.INSTANCE.watch(scrollbars.view);
                }}
                autoHeightMin="100%"
                onScroll={({ srcElement }) => {
                  setScrollLeft(srcElement.scrollLeft);
                }}
              >
                {freeCanvasMode ? (
                  <FreeCanvas />
                ) : (
                  <>
                    {masterScreenEnabled ? (
                      <MasterScreen scrollRef={scrollRef} />
                    ) : (
                      <TreeCanvas scrollRef={scrollRef} />
                    )}
                  </>
                )}
                {!freeCanvasMode && !isPrototypeMode && (
                  <ElementsInteractions posRight={scrollLeft} />
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
