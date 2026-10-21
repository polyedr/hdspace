import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { AppReduxState } from '@Redux/types';
import { AppThemeProvider } from '@Src/styles/Theme';
import { mockState } from '../../test-utils';
import Profile from '../../../../components/User/Profile';

describe('Profile', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;

  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    ui = render(
      <MemoryRouter><Provider store={store}>
        <AppThemeProvider>
          <Profile />
        </AppThemeProvider>
      </Provider></MemoryRouter>,
    );
  });

  it('should render profile page', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should have title', () => {
    const title = ui.getByText('Profile settings');
    expect(title).toBeInTheDocument();
  });
});
