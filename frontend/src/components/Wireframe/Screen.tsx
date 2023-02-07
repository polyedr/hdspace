import React, { useCallback } from 'react';
import {
  Card as MuiCard,
  styled,
  Typography as MuiTypography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllElements } from '@Redux/project/selectors/element';
import RENDERERS from '@Components/UI/RenderElements';
import useLayout from '@Components/Editor/hooks/useLayout';
import { setActiveElement, setActiveScreen } from '@Redux/wireframe/wireframe';
import { selectCurrentWireframeElement } from '@Redux/wireframe/selectors';
import { type Screen as ScreenType } from '@Src/types';
import { GRID_CELL_SPACE } from '@Constants/grid';
import ScreenFrame from './ScreenFrame';
import { type WireframeScreen } from './Canvas';

interface Props {
  data: WireframeScreen;
  active: boolean;
}

const ElementWrapper = styled('div')<{ active: boolean }>(({ active }) => ({
  display: 'inline-block',
  border: `1px solid ${active ? 'blue' : 'white'}`,
  padding: 5,
}));

const Card = styled(MuiCard)({
  // boxShadow: `0 0 1px ${active ? 4 : 1}px rgba(0,0,0,.2)`,
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

interface RenderElementProps {
  elementId: string;
  screen: ScreenType;
  allElements: any;
}

const RenderElement: React.FC<RenderElementProps> = ({
  elementId,
  screen,
  allElements,
}) => {
  const element = allElements[elementId];

  const dispatch = useDispatch();
  const isDisplayed = useLayout(element?.parameters.layouts);
  const activeElement = useSelector(selectCurrentWireframeElement);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(setActiveScreen(screen.id.toString()));
      dispatch(setActiveElement(elementId.toString()));
    },
    [elementId, screen.id],
  );

  if (!element || (!isDisplayed && element?.name !== 'Root')) {
    return null;
  }

  const ElementRenderer =
    RENDERERS[element.type === 'div' ? 'divBlock' : element.type];

  if (!ElementRenderer) {
    return null;
  }

  return (
    <ElementWrapper active={activeElement === elementId} onClick={handleClick}>
      <ElementRenderer isDisplayed={isDisplayed} element={element}>
        {element.children.map((childId: string) => (
          <RenderElement
            key={childId}
            screen={screen}
            elementId={childId}
            allElements={allElements}
          />
        ))}
      </ElementRenderer>
    </ElementWrapper>
  );
};

const Screen: React.FC<Props> = ({ data, active }) => {
  const rootId = data.element;
  const allElements = useSelector(selectAllElements);

  return (
    <Card>
      <Typography variant="h6" className={`handle-${data.id} screen-control`}>
        {data.name}
      </Typography>
      <ScreenFrame active={active}>
        <RenderElement
          screen={data}
          elementId={rootId}
          allElements={allElements}
        />
      </ScreenFrame>
    </Card>
  );
};

export default Screen;
