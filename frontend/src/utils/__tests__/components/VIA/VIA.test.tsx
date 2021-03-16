import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { mockState, mockVIAState } from '@Utils/__tests__/test-utils';
import VIA from '@Components/Editor/VIA/';

import { AppReduxState } from '@Redux/types';
import TYPES from '@Redux/actionTypes';

describe('VIA Region', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;
  const {
    region_attributes: { 'HTML element': type },
    id,
  } = Object.values(mockVIAState.regions)[0];

  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore({
      ...mockState,
      project: {
        ...mockState.project,
        edit: {
          ...mockState.project.edit,
          VIAMode: mockVIAState,
        },
      },
    });

    ui = render(
      <Provider store={store}>
        <VIA />
      </Provider>,
    );
  });

  it('should render VIA Regions wrapper', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should have a title', () => {
    const region = ui.getByText(type);
    expect(region).toBeInTheDocument();
  });

  it('should set region active on click', () => {
    const region = ui.getByText(type);
    fireEvent.click(region);
    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(TYPES.SET_ACTIVE_VIA_REGION);
    expect(actions[actions.length - 1].payload).toBe(id);
  });

  it('should set no active region on root click', () => {
    const root = ui.getByText(type).parentElement;
    if (!root) throw new Error('No root found');
    fireEvent.click(root);
    const actions = store.getActions();

    expect(actions[actions.length - 1].type).toBe(TYPES.SET_ACTIVE_VIA_REGION);
    expect(actions[actions.length - 1].payload).toBe('');
  });

  it('should handle dragEnd event', () => {
    const region = ui.getByText(type);
    fireEvent.dragStart(region);
    console.log(store.getActions());
  });
});
