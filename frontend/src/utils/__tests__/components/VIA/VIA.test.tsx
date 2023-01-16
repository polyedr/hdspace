import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { mockState, mockVIAState } from '@Utils/__tests__/test-utils';
import VIA from '@Components/Editor/VIA/';
import { AppReduxState } from '@Redux/types';
import TYPES from '@Redux/actionTypes';
import { vi } from 'vitest';

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(),
});

describe('VIA Region', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;
  const { id } = Object.values(mockVIAState.regions.fdict)[0];

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

  it('should set region active on click', () => {
    const region = ui.getByTestId(id);
    fireEvent.click(region);
    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(TYPES.SET_ACTIVE_VIA_REGION);
    expect(actions[actions.length - 1].payload.id).toBe(id);
  });

  it('should set no active region on root click', () => {
    const root = ui.getByTestId(id).parentElement;
    if (!root) throw new Error('No root found');
    fireEvent.click(root);
    const actions = store.getActions();

    expect(actions[actions.length - 1].type).toBe(TYPES.SET_ACTIVE_VIA_REGION);
    expect(actions[actions.length - 1].payload.id).toBe('');
  });
});
