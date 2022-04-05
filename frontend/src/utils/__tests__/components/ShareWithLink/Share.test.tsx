import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mockState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import Share from '@Components/Layout/TopBar/actions/Share';
import axios from 'axios';
import { shorten_url_api_key } from '@Constants/defaultParams';

const mockWriteText = jest.fn();
jest.mock('axios');

Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

const headers = {
  apikey: shorten_url_api_key,
};
// const url = 'http://localhost:8080/share/?user=99&project=1290&screen=4189&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjQ4NTczMTM2LCJqdGkiOiJmYzQ3MmNlYmExMzE0OTAyOTI4NzM1NjU5YjBmZjA5YyIsInVzZXJfaWQiOjk5fQ.iy37bZszk6qMhNmfHnUdaaF3O8WhKRBl44ZxOkbVlEg&refresh=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY0ODYxNjMzNiwianRpIjoiYmIyODQ1NDAyMGVmNDEyNWJhM2YwNjBiZjM4ODBjMDkiLCJ1c2VyX2lkIjo5OX0.NYXbdeYLf0-r5-3YFXDYLSFe5YTwRA62qufU7EtdNhg'
const url =
  'http://localhost/share/?user=777&project=1&screen=1&token=&refresh=';
describe('Share', () => {
  let store: MockStoreEnhanced<AppReduxState>;

  let ui: RenderResult;
  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    ui = render(
      <Provider store={store}>
        <Share />
      </Provider>,
    );
  });
  it('should render properly', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should open a popup on click', () => {
    const button = screen.getByTitle('Share');
    fireEvent.click(button);
    expect(screen.getByText('Copy screen link'));
    expect(screen.getByText('Copy element link'));
  });

  it.skip('should paste a screen link to a clipboard', () => {
    const shareButton = screen.getByTitle('Share');
    fireEvent.click(shareButton);
    const copyScreenLinkButton = screen.getByText('Copy screen link');
    fireEvent.click(copyScreenLinkButton);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.apilayer.com/short_url/hash',
      url,
      {
        headers,
      },
    );
  });

  it.skip('should paste an element link to a clipboard', () => {
    const shareButton = screen.getByTitle('Share');
    fireEvent.click(shareButton);
    const copyElementLinkButton = screen.getByText('Copy element link');
    fireEvent.click(copyElementLinkButton);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api.apilayer.com/short_url/hash',
      url,
      {
        headers,
      },
    );
  });
});
