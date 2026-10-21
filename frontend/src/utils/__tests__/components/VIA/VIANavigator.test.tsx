import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, RenderResult } from '@testing-library/react';
import VIANavigator from '@Components/LeftPanel/VIANavigator';
import { mockState, mockVIAState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import { AppThemeProvider } from '@Src/styles/Theme';

describe('VIANavigator', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;

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
      <MemoryRouter><Provider store={store}>
        <AppThemeProvider>
          <VIANavigator />
        </AppThemeProvider>
      </Provider></MemoryRouter>,
    );
  });

  it('should render VIANavigator', () => {
    expect(ui.container).toMatchSnapshot();
  });
});
