import { Entity } from '@Src/types';
import { AppReduxState } from '@Redux/types';
import { createSelector } from 'reselect';

export const selectMasterElements = ({ project }: AppReduxState) =>
  project.data.masterScreen.elements;

export const selectMasterElementById = (id: string) =>
  createSelector(selectMasterElements, (elements) => elements[id]);

export const selectActiveMasterElementId = ({ project }: AppReduxState) =>
  project.data.masterScreen.activeId;

export const selectActiveMasterElement = createSelector(
  selectMasterElements,
  selectActiveMasterElementId,
  (elements, id) => elements[id],
);

export const selectActiveMasterElementType = createSelector(
  selectActiveMasterElement,
  (element) => element.struct_type,
);

export const selectMasterScreenEnabled = ({ project }: AppReduxState) =>
  project.data.masterScreen.enabled;

// TODO: create selectActiveMasterElementSharedStyles selector
