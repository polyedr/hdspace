import { createSelector } from 'reselect';
import {
  DEFAULT_ACTIVE_ELEMENT,
  DEFAULT_ROOT,
  LABELED_INPUT_TYPES,
} from '@Constants/defaultParams';
import {
  arrayToMap,
  buildElementsTree,
  flattenElements,
} from '@Utils/normalizedStateHelpers';
import {
  ChildEntity,
  Entity,
  LibraryElement,
  PaginatedArray,
  Project,
  StateElement,
} from '@Src/types';
import {
  selectCurrentProject,
  selectEditableStyles,
  selectProjectState,
} from './base';
import { AppReduxState, ProjectState } from '../../types';
import {
  selectCurrentScreen,
  selectCurrentScreenId,
  selectScreenById,
  selectScreens,
} from './screen';

export const selectScreenRootElement = (screenId: number) => ({
  project,
}: AppReduxState) => {
  const rootId = project.data.screens[screenId]?.element;

  return buildElementsTree(project.data.elements, rootId) || DEFAULT_ROOT;
};

export const selectSavedElementsValues = ({ project }: AppReduxState) =>
  project.ui.savedElementsValues;

export const selectCurrentRootId = createSelector(
  selectCurrentScreen,
  (screen) => screen.element || '-1',
);

export const selectElementById = (id: string) => (state: AppReduxState) =>
  selectProjectState(state).data.elements[id];

export const selectElementsByIds = (ids: string[]) => (
  state: AppReduxState,
) => {
  if (!ids || !ids.length) {
    return [];
  }
  return ids.map((id: string) => selectElementById(id)(state));
};

export const selectElementAsTree = (id: string) => ({
  project,
}: AppReduxState) => {
  if (!(id in project.data.elements)) return DEFAULT_ROOT;

  return buildElementsTree(project.data.elements, id);
};

export const selectCurrentRootElement = (state: AppReduxState) => {
  const currentRootId = selectCurrentRootId(state);
  return selectElementAsTree(currentRootId)(state);
};

export const selectElementByChildId = (id: string) => (
  state: AppReduxState,
) => {
  const element = selectElementById(id)(state);
  return element && element.parent
    ? selectElementById(element.parent)(state)
    : null;
};

export const selectActiveElementId = ({ project }: AppReduxState) =>
  project.edit.activeElementId;

export const selectElementBeingEditedState = ({ project }: AppReduxState) =>
  project.ui.elementBeingEdited;

export const selectElementCanBeEditedState = ({ project }: AppReduxState) =>
  project.ui.elementCanBeEdited;

export const selectElementBeingEdited = (elementId: string) =>
  createSelector(
    selectActiveElementId,
    selectElementBeingEditedState,
    (activeElementId, elementBeingEdited) =>
      elementId === activeElementId && elementBeingEdited,
  );

export const selectElementCanBeEdited = (elementId: string) =>
  createSelector(
    selectActiveElementId,
    selectElementCanBeEditedState,
    (activeElementId, elementCanBeEdited) =>
      elementId === activeElementId && elementCanBeEdited,
  );

export const selectHoveredElementId = ({ project }: AppReduxState) =>
  project.edit.hoveredElementId;

export const selectAllElements = ({ project }: AppReduxState) =>
  project.data.elements;

export const selectActiveElement = createSelector(
  selectAllElements,
  selectActiveElementId,
  (elements, id) => elements[id] || DEFAULT_ACTIVE_ELEMENT,
);

function makeActiveElementInfoSelector<
  T extends StateElement,
  K extends 'styles' | 'parameters'
>(
  prop: K,
): <R extends T>(
  state: AppReduxState,
) => K extends 'styles' ? R['styles'] : R['parameters'] {
  return (state: AppReduxState) => {
    const activeElement = selectActiveElement(state);

    return activeElement[prop] as K extends 'styles'
      ? T['styles']
      : T['parameters'];
  };
}

export const selectActiveElementStyles = makeActiveElementInfoSelector(
  'styles',
);

export const selectCurrentEditableStyles = createSelector<
  AppReduxState,
  StateElement,
  Project,
  StateElement['styles'],
  string,
  React.CSSProperties
>(
  selectActiveElement,
  selectCurrentProject,
  selectActiveElementStyles,
  selectEditableStyles,
  (activeElement, currentProject, activeElementStyles, editableStyles) => {
    const { type } = activeElement;

    const activeElementClassNames = activeElementStyles.classNames;

    let activeEntityStyles = {};
    if (type !== 'none') {
      const projectClass = currentProject.projectData.classes.find(
        (cssClass) => cssClass.className === type,
      );
      if (projectClass) {
        activeEntityStyles = projectClass.rules;
      }
    }

    const activeSharedStyles =
      currentProject.projectData.classes.find(
        (cssClass) => cssClass.className === activeElementClassNames[1],
      )?.rules || {};

    const getActiveItemStyles = (activeStyles: string): React.CSSProperties => {
      if (activeStyles === 'ownStyles' || activeStyles === '') {
        return activeElementStyles.ownStyles as Required<React.CSSProperties>;
      }
      if (activeStyles === type) {
        return activeEntityStyles;
      }
      return activeSharedStyles;
    };

    const activeItemStyles = getActiveItemStyles(editableStyles);

    return {
      ...activeEntityStyles,
      ...activeSharedStyles,
      ...activeItemStyles,
    };
  },
);

export const selectCustomElementsHasNext = (state: AppReduxState) => {
  return !!selectProjectState(state).data.customElementsData.next;
};

export const selectActiveItemChildren = (childType: ChildEntity) =>
  createSelector(
    selectActiveElement,
    selectAllElements,
    (activeElement, elements) =>
      activeElement.children
        .map((childId) => elements[childId])
        .filter((child) => child.type === childType),
  );

export const selectElementStyles = (elementId: string) => ({
  project,
}: AppReduxState) => project.data.elements[elementId]?.styles.ownStyles;

export const selectElementParameters = (elementId: string) => ({
  project,
}: AppReduxState) => project.data.elements[elementId]?.parameters;

export const selectActiveItemChildrenStyles = makeActiveElementInfoSelector(
  'styles',
);

export const selectActiveElementParams = createSelector(
  selectActiveElement,
  (element) => element.parameters,
);

export const selectActiveElementParamByName = (name: string) => (
  state: AppReduxState,
) => selectActiveElementParams(state)[name];

export function selectItemToCopyInfo(state: AppReduxState) {
  return selectProjectState(state).ui.itemToCopyInfo;
}

export function selectCustomElementsPagination(
  state: AppReduxState,
): PaginatedArray<LibraryElement<Entity>> {
  return selectProjectState(state).data.customElementsData;
}

export const selectCustomLibraryElements = (
  state: AppReduxState,
): LibraryElement<Entity>[] => {
  return selectProjectState(state).data.customElementsData.results;
};

export const selectElementsForScreenById = (state, screenId) => {
  const screen = selectScreenById(screenId)(state);
  const rootId = screen.element;
  const tree = buildElementsTree(state.project.data.elements, rootId);
  return flattenElements([tree]);
};

export const selectElementsForScreen = (screenId: number) => (
  state: AppReduxState,
) => selectElementsForScreenById(state, screenId);

// RESELECT selectors
export const selectElementsForCurrentScreen = createSelector(
  selectAllElements,
  selectCurrentScreenId,
  selectScreens,
  (elements, id, screens) => {
    const screen = screens.find((screen) => screen.id === id);
    if (!screen) return {};

    const elementId = screen.element;

    const tree = buildElementsTree(elements, elementId);
    return flattenElements([tree]);
  },
);

export const selectDirectChildren = (id) =>
  createSelector(selectAllElements, (elements) => {
    const target = elements[id];
    if (!target) return {};

    return arrayToMap(target.children.map((childId) => elements[childId]));
  });

export const selectActiveLabelInputs = (state: AppReduxState) => {
  const activeItemParams = selectActiveElementParams(state);
  const elements = selectElementsForCurrentScreen(state);

  const inputsIDs = Object.values(elements)
    .filter((element) => LABELED_INPUT_TYPES.includes(element.type))
    .map((element) => element.id);

  return {
    inputsIDs,
    labelFor: activeItemParams.labelFor,
  };
};

export const selectIncludesActiveElement = (elementId: string) =>
  createSelector(
    selectAllElements,
    selectActiveElementId,
    selectCurrentRootId,
    (elements, activeElementId, rootId) => {
      const check = (id: string): boolean => {
        const parentId = elements[id]?.parent;
        if (!parentId) return false;
        if (parentId === elementId) return true;
        if (parentId === rootId) return false;
        return check(parentId);
      };

      return check(activeElementId);
    },
  );

export const selectCurrentRoot = createSelector(
  selectAllElements,
  selectCurrentRootId,
  (elements, rootId) => elements[rootId] || DEFAULT_ROOT,
);

export const selectDirectRootChildren = createSelector(
  selectAllElements,
  selectCurrentRootId,
  (elements, id) => {
    const root = elements[id];
    if (!root) return {};
    return arrayToMap(root.children.map((childId) => elements[childId]));
  },
);

export const selectIsElementActive = (elementId: string) =>
  createSelector(selectActiveElementId, (activeId) => activeId === elementId);

export const selectSelectedElementsIds = (state: AppReduxState) =>
  selectProjectState(state).edit.selectedElementsIds;

export const selectSelectedElements = createSelector(
  selectProjectState,
  selectSelectedElementsIds,
  (state: ProjectState, ids: string[]) => {
    return ids.reduce((acc, id: string) => {
      return {
        ...acc,
        [id]: state.data.elements[id],
      };
    }, {});
  },
);

export const selectIsElementSelected = (elementId: string) => (
  state: AppReduxState,
) => {
  const selectedElements = selectSelectedElementsIds(state);
  return selectedElements.includes(elementId);
};
