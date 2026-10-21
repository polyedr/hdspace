import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { mockState, mockVIAState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import VIADescription from '@Components/Editor/VIA/VIADescription';
import TYPES from '@Redux/actionTypes';
import { AppThemeProvider } from '../../../../styles/Theme';

describe('VIADescription', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;
  const region = Object.values(mockVIAState.regions.fdict)[0];
  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore({
      ...mockState,
      project: {
        ...mockState.project,
        edit: {
          ...mockState.project.edit,
          VIAMode: mockVIAState,
        },
      },
    });

    ui = render(
      <MemoryRouter><Provider store={store}>
        <AppThemeProvider>
          <VIADescription region={region} />
        </AppThemeProvider>
      </Provider></MemoryRouter>,
    );
  });

  it('should render a description', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should delete element on proper button click', () => {
    const deleteButton = ui.getByTitle('Delete region');
    fireEvent.click(deleteButton);

    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(TYPES.DELETE_VIA_REGION);
  });

  it('should display region width', () => {
    const widthInput = ui.getByLabelText('Width') as HTMLInputElement;
    expect(widthInput.value).toBe(region.shape_attributes.width.toString());
  });

  it('should display region height', () => {
    const heightInput = ui.getByLabelText('Height') as HTMLInputElement;
    expect(heightInput.value).toBe(region.shape_attributes.height.toString());
  });

  it('should display region x', () => {
    const xInput = ui.getByLabelText('X') as HTMLInputElement;
    expect(xInput.value).toBe(region.shape_attributes.x.toString());
  });

  it('should display region y', () => {
    const yInput = ui.getByLabelText('Y') as HTMLInputElement;
    expect(yInput.value).toBe(region.shape_attributes.y.toString());
  });
});
