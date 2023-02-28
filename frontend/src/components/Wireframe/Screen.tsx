import React from 'react';
import {
  Card as MuiCard,
  styled,
  Typography as MuiTypography,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAllElements } from '@Redux/project/selectors/element';
import RENDERERS from '@Components/UI/RenderElements';
import useLayout from '@Components/Editor/hooks/useLayout';
import { type Screen as ScreenType } from '@Src/types';
import { GRID_CELL_SPACE } from '@Constants/grid';
import { type WireframeScreen } from './helpers';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './constants';

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
  width: SCREEN_WIDTH,
  minHeight: SCREEN_HEIGHT,
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

  return (
    <Card>
      <Typography variant="h6" className={`handle-${data.id} screen-control`}>
        {data.name}
      </Typography>
      <MuiBox active={active} className="wireframe-screen-frame">
        <RenderElement
          screen={data}
          setRef={setRef}
          elementId={rootId}
          allElements={allElements}
        />
      </MuiBox>
    </Card>
  );
};

export default Screen;
