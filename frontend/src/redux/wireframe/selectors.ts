import { AppReduxState } from '@Redux/types';

export const selectCurrentWireframeScreen = (state: AppReduxState) =>
  state.wireframe.activeScreen;
export const selectCurrentWireframeElement = (state: AppReduxState) =>
  state.wireframe.activeElement;
