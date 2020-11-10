import React from 'react';
import configureStore from 'redux-mock-store';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import FreeCanvas from '../../../../components/Editor/FreeCanvas';
import { mockRootElement, mockState } from '../../test-utils';
import TYPES from '../../../../redux/actionTypes';

describe('Free Canvas', () => {
  let store;
  let ui;

  beforeEach(() => {
    const mockStore = configureStore([]);
    store = mockStore(mockState);

    ui = render(
      <Provider store={store}>
        <FreeCanvas />
      </Provider>,
    );
  });

  it('should render a "free canvas" container', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should set root as active element on click', () => {
    const root: HTMLElement = ui.container.firstChild as HTMLElement;
    fireEvent.click(root);

    const actions = store.getActions();
    expect(actions[0].type).toBe(TYPES.SET_ACTIVE_ELEMENT_ID);
    expect(actions[0].payload).toBe(mockRootElement.id);
  });
});
