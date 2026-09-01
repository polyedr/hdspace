import React from 'react';
import RENDERERS from '@Components/UI/RenderElements';
import { selectElementById } from '@Redux/project/selectors/element';
import { AppReduxState } from '@Redux/types';
import { selectLayout } from '@Redux/project/selectors/base';
import { Layout } from '@Src/types';

interface Props {
  elementId: string;
  state: AppReduxState;
}

const ExportedElement: React.FC<Props> = ({ elementId, state }) => {
  const element = selectElementById(state, elementId);
  const Component = RENDERERS[element.type];

  const { layouts } = element.parameters as { layouts: Layout[] };
  const currentLayout = selectLayout(state);
  const isDisplayed = layouts.includes(currentLayout);

  return isDisplayed ? (
    <Component element={element}>
      {element.children.map((childId) => (
        <ExportedElement
          key={`exported-${childId}`}
          elementId={childId}
          state={state}
        />
      ))}
    </Component>
  ) : null;
};

export default ExportedElement;
