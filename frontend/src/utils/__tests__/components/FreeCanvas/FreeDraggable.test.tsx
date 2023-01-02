import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import TYPES from '../../../../redux/actionTypes';
import { mockStateElement, mockState } from '../../test-utils';
import FreeDraggable from '../../../../components/Editor/FreeCanvas/FreeDraggable';
import { splitWords } from '../../../stringHelper';

describe('Free Draggable', () => {
  let store;
  let ui;

  beforeEach(() => {
    const mockStore = configureStore([]);
    store = mockStore(mockState);

    ui = render(
      <Provider store={store}>
        <FreeDraggable elementId={mockStateElement.id}>
          {mockStateElement.parameters.textContent}
        </FreeDraggable>
      </Provider>,
    );
  });

  it('should render free draggable component', async () => {
    expect(ui.container).toMatchSnapshot();
  });

  it("should set it's id as active element id on click", () => {
    fireEvent.click(ui.container.firstChild as HTMLElement);

    const actions = store.getActions();

    expect(actions[0].type).toEqual(TYPES.SET_ACTIVE_ELEMENT_SAGA);
    expect(actions[0].payload).toEqual(mockStateElement.id);
  });

  it('should have a crumb', () => {
    const crumb = ui.getByText(splitWords(mockStateElement.name));
    expect(crumb).toBeInTheDocument();
  });

  it('crumb should be hidden by default', () => {
    const crumb = ui.getByText(splitWords(mockStateElement.name));
    expect(crumb).not.toBeVisible();
  });

  it('should open z-index-control after "settings" button click', () => {
    const zIndexControl = ui.getByRole('menu', { hidden: true });
    const settingsButton = ui.getByTitle('Settings');

    fireEvent.click(settingsButton);
    expect(zIndexControl).not.toHaveAttribute('hidden');
  });

  it('should change elements z-index on buttons click', () => {
    const upButton = ui.getByTitle('Move element up');
    fireEvent.click(upButton);
    const actions = store.getActions();

    expect(actions[0].type).toBe(TYPES.UPDATE_ELEMENT_PARAMETERS);
    expect(actions[0].payload.parameters.freeCanvas.zIndex).toBeTruthy();
  });

  it('downButton should be disabled if z-index is 0', () => {
    const downButton = ui.getByTitle('Move element down');
    expect(downButton).toBeDisabled();
  });
});
