// @ts-nocheck
import React from 'react';
import { createSelector } from 'reselect';
import { DEFAULT_ROOT, LABELED_INPUT_TYPES } from '@Constants/defaultParams';
import {
  arrayToMap,
  buildElementsTree,
  buildGroupElementsTree,
  flattenElements,
  getAllElementChildrenIds,
} from '@Utils/normalizedStateHelpers';
import {
  ChildEntity,
  Entity,
  LibraryElement,
  PaginatedArray,
  Project,
  StateElement,
} from '@Src/types';
import { AppReduxState, ProjectState } from '../../types';
import {
  selectCurrentProject,
  selectEditableStyles,
  selectProjectState,
} from './base';
import {
  selectCurrentScreen,
  selectCurrentScreenId,
  selectMasterScreen,
  selectScreenById,
  selectScreens,
} from './screen';

export const selectScreenRootElement =
  (screenId: number) =>
  ({ project }: AppReduxState) => {
    const rootId = project.data.screens[screenId]?.element;

    return buildElementsTree(project.data.elements, rootId) || DEFAULT_ROOT;
  };

export const selectScreen =
  (screenId: number) =>
  ({ project }: AppReduxState) =>
    project.data.screens[screenId]?.screenData;
export const selectSavedElementsValues = ({ project }: AppReduxState) =>
  project.ui.savedElementsValues;

export const selectCurrentRootId = createSelector(
  selectCurrentScreen,
  (screen) => screen.element || '-1',
);

/* for use in sagas only */
export const selectElementById = (state: AppReduxState, id: string) =>
  selectProjectState(state).data.elements[id];

/* for use in components only */
export const selectElementByIdWrapper =
  (id: string) => (state: AppReduxState) =>
    selectProjectState(state).data.elements[id];

export const selectElementsByIds =
  (ids: string[]) => (state: AppReduxState) => {
    if (!ids || !ids.length) {
      return [];
    }
    return ids.map((id: string) => selectElementById(state, id));
  };

export const selectElementAsTree =
  (id: string) =>
  ({ project }: AppReduxState) => {
    if (!(id in project.data.elements)) return DEFAULT_ROOT;

    return buildElementsTree(project.data.elements, id);
  };

export const selectCurrentRootElement = (state: AppReduxState) => {
  const currentRootId = selectCurrentRootId(state);
  return selectElementAsTree(currentRootId)(state);
};

export const selectElementByChildId =
  (id: string) => (state: AppReduxState) => {
    const element = selectElementById(state, id);
    return element && element.parent
      ? selectElementById(state, element.parent)
      : null;
  };

export const selectActiveElementId = ({ project }: AppReduxState) =>
  project.edit.activeElementId;

export const checkIsLibraryTab = ({ project }: AppReduxState) =>
  project.edit.isLibraryTab;

export const selectActiveNNModel = ({ project }: AppReduxState) =>
  project.edit.activeNNModel;

export const selectHoveredElementId = ({ project }: AppReduxState) =>
  project.edit.hoveredElementId;

export const selectActiveEditingElementId = ({ project }: AppReduxState) =>
  project.edit.activeEditingElementId;

export const selectEnabledPseudoClass = ({ project }: AppReduxState) =>
  project.ui.pseudoClass;

export const selectAllElements = ({ project }: AppReduxState) =>
  project.data.elements;

export const selectElementsAsTrees =
  (ids: string[]) => (state: AppReduxState) => {
    const allElements = selectAllElements(state);

    return ids.map((id: string) => {
      if (!allElements[id]) {
        return DEFAULT_ROOT;
      }
      return buildElementsTree(allElements, id);
    });
  };

export const selectActiveElement = createSelector(
  selectAllElements,
  selectActiveElementId,
  (elements, id) => elements[id] || DEFAULT_ROOT,
);

export const selectParentOfActiveElement = createSelector(
  selectAllElements,
  selectActiveElementId,
  (elements, id) => {
    const parentId = elements[id]?.parent;
    if (!parentId) return null;
    return elements[parentId];
  },
);

export const selectCurrentGeneratorElements = createSelector(
  selectAllElements,
  selectActiveElementId,
  (elements, id) => {
    const childrenContainerIds = elements[id]?.children;
    const currentGeneratorElements = childrenContainerIds?.map(
      (id) => elements[id],
    );
    return currentGeneratorElements;
  },
);

export const getIndexOfSelectedElementInParentChildren = createSelector(
  selectActiveElement,
  selectParentOfActiveElement,
  (activeElement, rootElement) => {
    const index = rootElement?.children.indexOf(activeElement.id);
    return index || 0;
  },
);

function makeActiveElementInfoSelector<
  T extends StateElement,
  K extends 'styles' | 'parameters',
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

export const selectActiveElementStyles =
  makeActiveElementInfoSelector('styles');

export const selectCurrentEditableStyles = createSelector<
  AppReduxState,
  StateElement,
  Project,
  StateElement['styles'],
  string,
  string | null,
  React.CSSProperties
>(
  selectActiveElement,
  selectCurrentProject,
  selectActiveElementStyles,
  selectEditableStyles,
  selectEnabledPseudoClass,
  (
    activeElement,
    currentProject,
    activeElementStyles,
    editableStyles,
    pseudoClass,
  ) => {
    const { type } = activeElement;

    const activeElementClassNames = activeElementStyles.classNames || '';

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
        const { ownStyles, pseudoClassViewStyles } = activeElementStyles;
        return (
          pseudoClass ? pseudoClassViewStyles : ownStyles
        ) as Required<React.CSSProperties>;
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

export const selectCustomElementsHasNext = (state: AppReduxState) =>
  !!selectProjectState(state).data.customElementsData.next;

export const selectActiveElementChildren = createSelector(
  selectActiveElement,
  selectAllElements,
  (activeElement, elements) =>
    activeElement.children.map((childId) => elements[childId]),
);

export const selectActiveItemChildren = (childType: ChildEntity) =>
  createSelector(
    selectActiveElement,
    selectAllElements,
    (activeElement, elements) =>
      activeElement.children
        .map((childId) => elements[childId])
        .filter((child) => child.type === childType),
  );

export const selectElementStyles =
  (elementId: string) =>
  ({ project }: AppReduxState) =>
    project.data.elements[elementId]?.styles.ownStyles;

export const selectElementsStyles =
  (elementsIds: string[]) =>
  ({ project }: AppReduxState) =>
    elementsIds.map((id) => project.data.elements[id]?.styles.ownStyles);

export const selectElementParameters =
  (elementId: string) =>
  ({ project }: AppReduxState) =>
    project.data.elements[elementId]?.parameters;

export const selectActiveItemChildrenStyles =
  makeActiveElementInfoSelector('styles');

export const selectActiveElementParams = createSelector(
  selectActiveElement,
  (element) => element.parameters,
);

export const selectActiveElementParamByName =
  (name: string) => (state: AppReduxState) =>
    selectActiveElementParams(state)[name];

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
): Array<LibraryElement<Entity>> =>
  selectProjectState(state).data.customElementsData.results;

export const selectElementsForScreenById = (state, screenId) => {
  const screen = selectScreenById(state, screenId);
  const rootId = screen.element;
  const tree = buildElementsTree(state.project.data.elements, rootId);
  return flattenElements([tree]);
};

export const selectElementsForScreen =
  (screenId: number) => (state: AppReduxState) =>
    selectElementsForScreenById(state, screenId);

// RESELECT selectors
export const selectElementsForCurrentScreen = createSelector(
  selectAllElements,
  selectCurrentScreenId,
  selectScreens,
  (elements, id, screens) => {
    const screen = screens[id];
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
    .filter((element: any) => LABELED_INPUT_TYPES.includes(element.type))
    .map((element: any) => element.id);

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
  (state: ProjectState, ids: string[]) =>
    ids.reduce(
      (acc, id: string) => ({
        ...acc,
        [id]: state.data.elements[id],
      }),
      {},
    ),
);

export const selectIsElementSelected =
  (elementId: string) => (state: AppReduxState) => {
    const selectedElements = selectSelectedElementsIds(state);
    return selectedElements.includes(elementId);
  };

export const selectSharedStyles = (type: Entity) =>
  createSelector(
    selectCurrentProject,
    (project) =>
      project.projectData.classes.find(
        (projectClass) => projectClass.className === type,
      )?.rules,
  );

export const selectCanCreateGroup = (state: AppReduxState) =>
  selectProjectState(state).ui.canCreateGroup;

export const selectElementGroupIds = (state: AppReduxState) => {
  const { elements } = selectProjectState(state).data;

  return Object.keys(elements).filter(
    (elementId) => elements[elementId].parameters?.isGroup === true,
  );
};

export const selectMasterCoreElementId = (state: AppReduxState) =>
  state.project.edit.masterCoreElementId;

export const selectMasterGroupsElementId = (state: AppReduxState) =>
  state.project.edit.masterGroupsElementId;

export const selectMasterGroupsElement = (state: AppReduxState) => {
  const masterGroupsElId = selectMasterGroupsElementId(state);
  return selectElementById(state, masterGroupsElId);
};

export const selectElementGroups = (state: AppReduxState) => {
  const { elements } = selectProjectState(state).data;
  const masterGroupsEl = selectMasterGroupsElement(state);
  return masterGroupsEl?.children.map((childId) => elements[childId]) || [];
};

export const selectElementTreeGroups = (state: AppReduxState) => {
  const { elements } = selectProjectState(state).data;
  const groupIds = selectElementGroupIds(state);
  return groupIds.map((groupId) =>
    buildGroupElementsTree(elements, groupId, ['isGroup', 'groupElements']),
  );
};

export const selectTreeChildElementsIds =
  (elementId: string) =>
  ({ project }: AppReduxState) => {
    const parent = project.data.elements[elementId];
    return !parent
      ? []
      : parent.children.reduce(
          (allChildren: string[], childId) => [
            ...allChildren,
            ...getAllElementChildrenIds(project.data.elements, childId),
          ],
          [],
        );
  };

export const selectTreeChildIdsByParentsIds =
  (ids: string[]) =>
  ({ project }: AppReduxState) => {
    const parentElements = ids.map((id: string) => project.data.elements[id]);
    return parentElements.reduce<string[]>(
      (allChildIds: string[], parentElement: StateElement) => [
        ...allChildIds,
        ...getAllElementChildrenIds(project.data.elements, parentElement.id),
      ],
      [],
    );
  };

export const selectMasterScreenRoot = (state: AppReduxState) => {
  const masterScreen = selectMasterScreen(state);
  if (!masterScreen) {
    return null;
  }
  return selectElementById(state, masterScreen.element);
};

export const selectElementsChildren =
  (ids: string[]) => (state: AppReduxState) => {
    const allElementsArray = Object.values(selectAllElements(state));

    return ids
      .map((id: string) =>
        allElementsArray.filter((element) => element.parent === id),
      )
      .reduce((children, childrenArray) => [...children, ...childrenArray], []);
  };

export const selectPreSelectedElementId = ({ project }: AppReduxState) =>
  project.edit.preSelectedElementId;

export const selectMasterSourceElementId = ({ project }: AppReduxState) =>
  project.edit.masterSourceElementId;
