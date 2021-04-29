import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { mockState, mockVIAState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import VIADescription from '@Components/Editor/VIA/VIADescription';
import { MuiThemeProvider } from '@material-ui/core/styles';
import TYPES from '@Redux/actionTypes';
import theme from '../../../../styles/Theme';

describe('VIADescription', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;
  const region = Object.values(mockVIAState.regions)[0];
  const {
    region_attributes: { 'HTML element': type },
  } = region;

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
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <VIADescription region={region} />
        </MuiThemeProvider>
      </Provider>,
    );
  });

  it('should render a description', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should display region type', () => {
    const typeInput = ui.getByLabelText('Type') as HTMLInputElement;
    expect(typeInput.value).toBe(type);
  });

  it('should change region type', () => {
    const typeInput = ui.getByLabelText('Type') as HTMLInputElement;
    fireEvent.change(typeInput, {
      target: {
        value: 'container',
      },
    });

    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(TYPES.UPDATE_VIA_REGION);
    expect(
      actions[actions.length - 1].payload.data.region_attributes[
        'HTML element'
      ],
    ).toBe('container');
  });

  it('should delete element on proper button click', () => {
    const deleteButton = ui.getByTitle('Delete region');
    fireEvent.click(deleteButton);

    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(
      TYPES.DELETE_VIA_REGION_SUCCESS,
    );
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
