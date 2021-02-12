import { Entity } from '@Src/types';
import { AppReduxState } from '@Redux/types';

export const selectMasterElement = (type: Entity) => ({
  project,
}: AppReduxState) => project.data.masterScreen.elements[type];

export const selectActiveMasterElement = ({ project }: AppReduxState) =>
  project.data.masterScreen.active;

export const selectMasterScreenEnabled = ({ project }: AppReduxState) =>
  project.data.masterScreen.enabled;
