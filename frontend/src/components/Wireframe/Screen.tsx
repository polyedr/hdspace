import React, { useCallback } from 'react';
import { type WireframeScreen } from './Canvas';
import {
  Card as MuiCard,
  styled,
  Typography as MuiTypography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllElements } from '@Redux/project/selectors/element';
import RENDERERS from '@Components/UI/RenderElements';
import useLayout from '@Components/Editor/hooks/useLayout';
import ScreenFrame from './ScreenFrame';
import { setActiveElement, setActiveScreen } from '@Redux/wireframe/wireframe';
import { selectCurrentWireframeElement } from '@Redux/wireframe/selectors';

interface Props {
  data: WireframeScreen;
  active: boolean;
}

const ElementWrapper = styled('div')<{ active: boolean }>(({ active }) => ({
  display: 'inline-block',
  border: `1px solid ${active ? 'blue' : 'white'}`,
  padding: 5,
}));

const Card = styled(MuiCard)<{ active: boolean }>(({ active }) => ({
  // boxShadow: `0 0 1px ${active ? 4 : 1}px rgba(0,0,0,.2)`,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  overflow: 'inherit',
}));

const Typography = styled(MuiTypography)({
  fontWeight: 400,
  color: 'black',
  cursor: 'move',
});

const RenderElement = ({ elementId, screenId, allElements }) => {
  const element = allElements[elementId];

  const dispatch = useDispatch();
  const isDisplayed = useLayout(element?.parameters.layouts);
  const activeElement = useSelector(selectCurrentWireframeElement);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      dispatch(setActiveScreen(screenId.toString()));
      dispatch(setActiveElement(elementId.toString()));
    },
    [elementId, screenId],
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
            screenId={screenId}
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
  const dispatch = useDispatch();

  const handleSceeenClick = () => {
    dispatch(setActiveScreen(data.id.toString()));
  };

  return (
    <Card active={active} onClick={handleSceeenClick}>
      <Typography variant="h6" className={`handle-${data.id}`}>
        {data.name}
      </Typography>
      <ScreenFrame>
        <RenderElement
          screenId={data.id}
          elementId={rootId}
          allElements={allElements}
        />
      </ScreenFrame>
    </Card>
  );
};

export default Screen;
