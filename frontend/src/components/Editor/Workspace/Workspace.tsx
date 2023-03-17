import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Scrollbars from 'react-custom-scrollbars';
import { makeStyles, styled } from '@mui/styles';
import _GridLines from 'react-gridlines';
import TreeCanvas from '@Components/Editor/TreeCanvas';
import MasterScreen from '@Components/Editor/MasterScreen';
import { FrameWrapper } from '@Components/Editor/FrameWrapper';
import {
  selectMasterScreenEnabled,
  selectFreeCanvasMode,
} from '@Redux/project/selectors/screen';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import {
  selectLayout,
  selectScreenRotated,
  selectShowingGrid,
} from '@Redux/project/selectors/base';
import ELEMENT_IDS from '@Constants/elementIds';
import { selectActiveEditingElementId } from '@Redux/project/selectors/element';
import NNProcessingModal from '../../Dialogs/NNProcessing';
import Scrollbar from '../../UI/Scrollbar';
import FreeCanvas from '../FreeCanvas';
import EditorViewport from '../Viewport/Viewport';
import ElementsInteractions from './ElementsInteractions/ElementsInteractions';
import { DOMHandler } from './DOMHandler';
import HoverInterations from './ElementsInteractions/HoverInterations';

const GridLines = _GridLines.default ? _GridLines.default : _GridLines;

const StyledGridLines = styled(GridLines)({
  height: '100%',
});

const WrapInGridLine: React.FC<{ wrap: boolean }> = ({ wrap, children }) => {
  const props = wrap
    ? { backgroundColor: 'white' }
    : { style: { background: 'white' } };

  return (
    <div style={{ backgroundColor: 'white', height: '100%' }}>
      <StyledGridLines
        className="grid-area"
        {...props}
        cellWidth={60}
        strokeWidth={2}
        cellWidth2={12}
      >
        {children}
      </StyledGridLines>
    </div>
  );
};

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

interface Props {
  elementId?: string;
}

const Workspace: React.FC<Props> = () => {
  const isPrototypeMode = useSelector(selectIsPrototypeMode);
  const freeCanvasMode = useSelector(selectFreeCanvasMode);

  const [scrollbarRef, setScrollbarRef] = useState<Scrollbars | null>(null);
  const activeEditingElementId = useSelector(selectActiveEditingElementId);

  const format = useSelector(selectLayout);
  const rotated = useSelector(selectScreenRotated);
  const masterScreenEnabled = useSelector(selectMasterScreenEnabled);
  const showGrid = useSelector(selectShowingGrid);

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
                onScroll={(event) => {
                  setScrollLeft(event.currentTarget.scrollLeft);
                }}
              >
                <WrapInGridLine wrap={showGrid}>
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
                </WrapInGridLine>
                {!freeCanvasMode &&
                  !isPrototypeMode &&
                  activeEditingElementId === null && (
                    <ElementsInteractions posRight={scrollLeft} />
                  )}
                {isPrototypeMode && <HoverInterations />}
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
