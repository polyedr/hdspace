/* eslint-disable import/no-extraneous-dependencies */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ChatLogin from '../../../../components/Sidebar/Chat/ChatLogin';

const mockStore = configureMockStore();

describe('ChatLogin test', () => {
  it('if passwordZulip is empty, the open register page', async () => {
    const store = mockStore({
      user: { userData: { profile: { parameters: { passwordZulip: null } } } },
    });
    render(
      <Provider store={store}>
        <ChatLogin />
      </Provider>,
    );
    expect(screen.getAllByText(/register/i)).not.toBeNull();
    const button = screen.getAllByRole('button', {
      name: /register/i,
    });
    expect(button.length !== 0);
  });
});
