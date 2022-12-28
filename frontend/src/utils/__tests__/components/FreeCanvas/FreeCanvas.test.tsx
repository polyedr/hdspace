import React from 'react';
import configureStore from 'redux-mock-store';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import TYPES from '@Redux/actionTypes';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import FreeCanvas from '../../../../components/Editor/FreeCanvas';
import { mockRootElement, mockState } from '../../test-utils';

describe('Free Canvas', () => {
  let store;
  let ui;

  beforeEach(() => {
    const mockStore = configureStore([]);
    store = mockStore(mockState);

    ui = render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <FreeCanvas />
        </DndProvider>
      </Provider>,
    );
  });

  it('should render a "free canvas" container', async () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should set root as active element on click', async () => {
    const root: HTMLElement = ui.container.firstChild as HTMLElement;
    fireEvent.click(root);

    const actions = store.getActions();
    expect(actions[0].type).toBe(TYPES.SET_ACTIVE_ELEMENT_SAGA);
    expect(actions[0].payload).toBe(mockRootElement.id);
  });
});
