import React from 'react';
import RENDERERS from '@Components/UI/RenderElements';
import {
  selectCurrentRootId,
  selectElementById,
  selectSavedElementsValues,
} from '@Redux/project/selectors/element';
import { AppReduxState } from '@Redux/types';
import { SharedRendererProps } from '@Components/UI/RenderElements/types';
import {
  selectCurrentProject,
  selectLayout,
} from '@Redux/project/selectors/base';
import { toClassName } from '@Utils/stringHelper';
import { Layout, StateElement } from '@Src/types';

type Props = {
  elementId: string;
  state: AppReduxState;
};

const getAdditionalProps = (element: StateElement, projectClasses, state) => {
  const savedElements = selectSavedElementsValues(state);
  const { id, type, children } = element;
  switch (type) {
    case 'textinput': {
      return {
        currentValue: String(savedElements[id]?.savedValue),
        params: element.parameters,
      };
    }

    case 'textarea': {
      return {
        currentValue: savedElements[id]?.savedValue,
        params: element.parameters,
      };
    }

    case 'checkbox':
    case 'radiobutton': {
      return {
        params: element.parameters,
      };
    }
    case 'select': {
      return {
        childrenElements: children,
        params: element.parameters,
        projectClasses,
      };
    }
    case 'dropdownMenu': {
      return {
        params: element.parameters,
        parentId: element.parent,
      };
    }
    default:
      return {
        params: element.parameters,
      };
  }
};

const getExportedProps = (elementId, state) => {
  const element = selectElementById(elementId)(state);
  const rootID = selectCurrentRootId(state);

  const currentProject = selectCurrentProject(state);

  const projectClasses = currentProject.projectData.classes;
  const { id, styles } = element;

  const [className, groupClass] = element.styles.classNames;

  const additionalProps = getAdditionalProps(element, projectClasses, state);

  const commonRendererProps: Omit<SharedRendererProps, 'children'> = {
    id: id === rootID ? 'root' : id,
    className,
    isDisabled: false,
    ownStyles: styles.ownStyles,
    groupClass: toClassName(groupClass),
    contentEditable: false,
    active: false,
  };

  return {
    ...commonRendererProps,
    ...additionalProps,
  };
};

const ExportedElement: React.FC<Props> = ({ elementId, state }) => {
  const element = selectElementById(elementId)(state);
  const Component = RENDERERS[element.type];
  const exportedProps = getExportedProps(elementId, state);

  const { layouts } = exportedProps.params as { layouts: Layout[] };
  const currentLayout = selectLayout(state);
  const isDisplayed = layouts.includes(currentLayout);

  return isDisplayed ? (
    <Component {...exportedProps}>
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
