import {
  // fireEvent,
  render,
  RenderResult,
  // screen,
} from '@testing-library/react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import { mockState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import Share from '@Components/Layout/TopBar/actions/Share';
import { MemoryRouter } from 'react-router-dom';

const mockWriteText = vi.fn();

Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});
describe('Share', () => {
  let store: MockStoreEnhanced<AppReduxState>;

  let ui: RenderResult;
  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    ui = render(
      <MemoryRouter><Provider store={store}>
        <Share />
      </Provider></MemoryRouter>,
    );
  });
  it('should render properly', () => {
    expect(ui.container).toMatchSnapshot();
  });

  // it('should open a popup on click', () => {
  //   const button = screen.getByTitle('Share');
  //   fireEvent.click(button);
  //   expect(screen.getByText('Copy screen link'));
  // });

  // it.skip('should paste a screen link to a clipboard', () => {
  //   const shareButton = screen.getByTitle('Share');
  //   fireEvent.click(shareButton);
  //   const copyScreenLinkButton = screen.getByText('Copy screen link');
  //   fireEvent.click(copyScreenLinkButton);
  //   expect(axios.post).toHaveBeenCalledWith(
  //     'https://api.apilayer.com/short_url/hash',
  //     url,
  //     {
  //       headers,
  //     },
  //   );
  // });

  // it.skip('should paste an element link to a clipboard', () => {
  //   const shareButton = screen.getByTitle('Share');
  //   fireEvent.click(shareButton);
  //   const copyElementLinkButton = screen.getByText('Copy element link');
  //   fireEvent.click(copyElementLinkButton);
  //   expect(axios.post).toHaveBeenCalledWith(
  //     'https://api.apilayer.com/short_url/hash',
  //     url,
  //     {
  //       headers,
  //     },
  //   );
  // });
});
