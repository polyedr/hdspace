import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import TYPES from '@Redux/actionTypes';
import { mockState } from '../../test-utils';
import Profile from '../../../../components/User/Profile';
import { AppReduxState } from '../../../../redux/types';

describe('Profile', () => {
  let store: MockStoreEnhanced<AppReduxState>;

  let ui: RenderResult;

  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    ui = render(
      <Provider store={store}>
        <Profile />
      </Provider>,
    );
  });

  it('should render profile page', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should have title', () => {
    const title = ui.getByText('Profile settings');

    expect(title).toBeInTheDocument();
  });

  it('should log out on proper button click', () => {
    const button = ui.getByText('Log out');

    fireEvent.click(button);

    const actions = store.getActions();

    expect(actions[actions.length - 1].type).toBe(TYPES.LOGOUT_START);
  });
});
