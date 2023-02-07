import { createSelector } from 'reselect';
import { AppReduxState } from '@Redux/types';

export const selectCurrentWireframeScreen = (state: AppReduxState) =>
  state.wireframe.present.activeScreen;
export const selectCurrentWireframeElement = (state: AppReduxState) =>
  state.wireframe.present.activeElement;
export const selectCurrentWireframeConnections = (state: AppReduxState) =>
  state.wireframe.present.connections;

export const selectCurrentWireframeScreenConnections = createSelector(
  selectCurrentWireframeConnections,
  selectCurrentWireframeScreen,
  (connections, screenId) => connections.filter((c) => c.screenId === screenId),
);

export const selectCompleteConnections = createSelector(
  selectCurrentWireframeConnections,
  (connections) =>
    connections.filter(
      (c) =>
        c.sourceElement !== '' && c.destinationScreen !== '' && c.event !== '',
    ),
);

export const selectCanUndoWireframe = (state: AppReduxState) =>
  state.wireframe.past.length > 0;
export const selectCanRedoWireframe = (state: AppReduxState) =>
  state.wireframe.future.length > 0;
