import { render } from '@testing-library/react';
import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { mockState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import SharedWithLink from '@Components/User/SharedWithLink';
import { vi } from 'vitest';

import { Provider } from 'react-redux';

const mockHistoryPush = vi.fn();

vi.mock('react-router', () => ({
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

  it('should push to another route', () => {
    expect(mockHistoryPush).toHaveBeenCalled();
  });
});
