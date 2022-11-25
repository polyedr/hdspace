import React from 'react';
import VIANavigator from '@Components/LeftPanel/VIANavigator';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, RenderResult } from '@testing-library/react';
import { mockState, mockVIAState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { themeOld as theme } from '@Src/styles/Theme';

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
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <VIANavigator />
        </MuiThemeProvider>
      </Provider>,
    );
  });

  it('should render VIANavigator', () => {
    expect(ui.container).toMatchSnapshot();
  });
});
