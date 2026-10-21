import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { mockState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import SharedWithLink from '@Components/User/SharedWithLink';

const mockHistoryPush = vi.fn();

vi.mock('@/compat/router', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
    replace: vi.fn(),
    go: vi.fn(),
    goBack: vi.fn(),
    goForward: vi.fn(),
    location: { pathname: '/', search: '', hash: '', state: null },
  }),
}));

describe('Share', () => {
  let store: MockStoreEnhanced<AppReduxState>;

  beforeEach(() => {
    mockHistoryPush.mockClear();
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    render(
      <MemoryRouter>
        <Provider store={store}>
          <SharedWithLink />
        </Provider>
      </MemoryRouter>,
    );
  });

  it('should push to another route', () => {
    expect(mockHistoryPush).toHaveBeenCalled();
  });
});
