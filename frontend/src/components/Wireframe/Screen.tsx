import React, { useMemo } from 'react';
import {
  Card as MuiCard,
  styled,
  Typography as MuiTypography,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useXarrow } from 'react-xarrows';
import { selectAllElements } from '@Redux/project/selectors/element';
import RENDERERS from '@Components/UI/RenderElements';
import useLayout from '@Components/Editor/hooks/useLayout';
import { type Screen as ScreenType } from '@Src/types';
import { GRID_CELL_SPACE } from '@Constants/grid';
import { useWireframe } from '@Src/hooks/useWireframe';
import { type WireframeScreen } from './helpers';

interface Props {
  data: WireframeScreen;
  active: boolean;
  setRef: (key: string) => void;
}

const Card = styled(MuiCard)({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  overflow: 'inherit',
});

const Typography = styled(MuiTypography)({
  fontWeight: 400,
  color: 'black',
  cursor: 'move',
  height: GRID_CELL_SPACE * 2,
  lineHeight: GRID_CELL_SPACE * 2 + 'px',
});

const MuiBox = styled(Box)<{ active: boolean }>(({ active, theme }) => ({
  position: 'relative',
  overflow: 'auto',
  backgroundColor: 'white',
  boxShadow: `0 0 ${active ? 10 : 6}px 0 rgba(0, 0, 0, 0.08)`,
  border: `2px solid ${active ? 'black !important' : 'white'}`,
  cursor: 'auto',
  '&:hover': {
    border: '2px solid purple',
  },
}));

interface RenderElementProps {
  elementId: string;
  screen: ScreenType;
  allElements: any;
  setRef: (key: string) => void;
}

const RenderFreeCanvasElement: React.FC<RenderElementProps> = ({
  elementId,
  screen,
  allElements,
  setRef,
}) => {
  const element = allElements[elementId];
  const isDisplayed = useLayout(element?.parameters.layouts);

  if (!element || (!isDisplayed && element?.name !== 'Root')) {
    return null;
  }

  const ElementRenderer =
    RENDERERS[element.type === 'div' ? 'divBlock' : element.type];

  if (!ElementRenderer) {
    return null;
  }

  const {
    parameters: {
      freeCanvas: { left = 0, top = 0, width = 0, height = 0, zIndex = 0 } = {},
    },
  } = element;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        zIndex,
      }}
    >
      <ElementRenderer
        isDisplayed={isDisplayed}
        element={element}
        ref={setRef(`element-${elementId}`)}
      >
        {element.children.map((childId: string) => (
          <RenderFreeCanvasElement
            key={childId}
            screen={screen}
            elementId={childId}
            allElements={allElements}
            setRef={setRef}
          />
        ))}
      </ElementRenderer>
    </div>
  );
};

const RenderElement: React.FC<RenderElementProps> = ({
  elementId,
  screen,
  allElements,
  setRef,
}) => {
  const element = allElements[elementId];
  const isDisplayed = useLayout(element?.parameters.layouts);

  if (!element || (!isDisplayed && element?.name !== 'Root')) {
    return null;
  }

  const ElementRenderer =
    RENDERERS[element.type === 'div' ? 'divBlock' : element.type];

  if (!ElementRenderer) {
    return null;
  }

  return (
    <ElementRenderer
      isDisplayed={isDisplayed}
      element={element}
      ref={setRef(`element-${elementId}`)}
    >
      {element.children.map((childId: string) => (
        <RenderElement
          key={childId}
          screen={screen}
          elementId={childId}
          allElements={allElements}
          setRef={setRef}
        />
      ))}
    </ElementRenderer>
  );
};

const Screen: React.FC<Props> = ({ data, active, setRef }) => {
  const rootId = data.element;
  const allElements = useSelector(selectAllElements);

  const updateArrows = useXarrow();

  const isFreecanvas = data.screenData.freeCanvas;

  const {
    layout: [width, height],
  } = useWireframe();

  const layoutHeight = useMemo(() => {
    let h = 0;
    let maxX = 0;

    function walkElements(elementId: string) {
      const element = allElements[elementId];

      const {
        parameters: {
          freeCanvas: { top, height },
        },
      } = element;

      if (top > maxX) {
        maxX = top;
        h = top + height;
      }

      element.children.forEach((childElementId) => {
        walkElements(childElementId);
      });
    }

    if (isFreecanvas) {
      walkElements(data.element);
    }

    return Math.max(h, height);
  }, [isFreecanvas, height]);

  return (
    <Card>
      <Typography variant="h6" className={`handle-${data.id} screen-control`}>
        {data.name}
      </Typography>
      <MuiBox
        style={{ width, minHeight: layoutHeight }}
        active={active}
        className="wireframe-screen-frame"
        onScroll={updateArrows}
      >
        {isFreecanvas ? (
          <RenderFreeCanvasElement
            screen={data}
            setRef={setRef}
            elementId={rootId}
            allElements={allElements}
          />
        ) : (
          <RenderElement
            screen={data}
            setRef={setRef}
            elementId={rootId}
            allElements={allElements}
          />
        )}
      </MuiBox>
    </Card>
  );
};

export default Screen;
