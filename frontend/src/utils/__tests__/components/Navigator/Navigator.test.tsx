import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { AppThemeProvider } from '@Src/styles/Theme';
import Navigator from '../../../../components/LeftPanel/Navigator';
import { mockState } from '../../test-utils';

describe('Navigator', () => {
  let store;
  let ui;

  beforeEach(() => {
    const mockStore = configureStore([]);
    store = mockStore(mockState);

    ui = render(
      <Provider store={store}>
        <AppThemeProvider>
          <Navigator />
        </AppThemeProvider>
      </Provider>,
    );
  });

  it('should render a Navigator component', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('open context menu on tree item right click', async () => {
    const treeItem = ui.getByRole('treeitem');
    fireEvent.contextMenu(treeItem);

    // TODO: fix test - adapt check for CHANGE_PROJECT permission
    // const menu = ui.getByRole('menu');
    // expect(menu).toBeInTheDocument();
  });
});
