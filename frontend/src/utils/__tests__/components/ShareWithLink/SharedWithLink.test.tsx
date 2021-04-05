import { render } from '@testing-library/react';
import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { mockState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import SharedWithLink from '@Components/User/SharedWithLink';

const { Provider } = jest.requireActual('react-redux');

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('Share', () => {
  let store: MockStoreEnhanced<AppReduxState>;

  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    render(
      <Provider store={store}>
        <SharedWithLink />
      </Provider>,
    );
  });
  /* 
  it('should dispatch logout first', () => {
    const actions = store.getActions();
    expect(actions[0].type).toBe(TYPES.LOGOUT);
  });

  it('should dispatch setTokenPair action', () => {
    const actions = store.getActions();
    expect(actions[1].type).toBe(TYPES.SET_TOKEN_PAIR);
  });

  it('should dispatch setUserData action', () => {
    const actions = store.getActions();
    expect(actions[2].type).toBe(TYPES.SET_USER_DATA);
  }); */

  it('should push to another route', () => {
    expect(mockHistoryPush).toHaveBeenCalled();
  });
});
