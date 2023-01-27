import { AppReduxState } from '@Redux/types';
import { createSelector } from 'reselect';

export const selectCurrentWireframeScreen = (state: AppReduxState) =>
  state.wireframe.activeScreen;
export const selectCurrentWireframeElement = (state: AppReduxState) =>
  state.wireframe.activeElement;
export const selectCurrentWireframeConnections = (state: AppReduxState) =>
  state.wireframe.connections;

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
