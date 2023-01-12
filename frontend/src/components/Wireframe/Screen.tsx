import React from 'react';
import { type WireframeScreen } from './Canvas';
import { Card, ThemeProvider } from '@mui/material';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectAllElements } from '@Redux/project/selectors/element';
import RENDERERS from '@Components/UI/RenderElements';
import useLayout from '@Components/Editor/hooks/useLayout';
import FrameComponent, { FrameContextConsumer } from 'react-frame-component';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { theme } from '@Src/styles/Theme';

interface Props {
  data: WireframeScreen;
}

const RenderElement = ({ elementId, allElements }) => {
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
    <ElementRenderer element={element}>
      {element.children.map((childId) => (
        <RenderElement
          key={childId}
          elementId={childId}
          allElements={allElements}
        />
      ))}
    </ElementRenderer>
  );
};

const Screen: React.FC<Props> = ({ data }) => {
  const rootId = data.element;
  const allElements = useSelector(selectAllElements);

  return (
    <Card>
      <Typography variant="h6" className={`handle-${data.id}`}>
        {data.name}
      </Typography>
      <FrameComponent frameBorder={0} width={400} height={600}>
        <FrameContextConsumer>
          {({ document: frameDocument }) => {
            const cache = createCache({
              key: 'css',
              container: frameDocument.head,
              prepend: true,
            });

            return (
              <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                  <RenderElement elementId={rootId} allElements={allElements} />
                </ThemeProvider>
              </CacheProvider>
            );
          }}
        </FrameContextConsumer>
      </FrameComponent>
    </Card>
  );
};

export default Screen;
