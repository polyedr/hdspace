import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { Provider } from 'react-redux';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { mockState, mockVIAState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { themeOld as theme } from '@Src/styles/Theme';
import VIARightPanel from '@Components/Editor/VIA/VIARightPanel';
import TYPES from '@Redux/actionTypes';

describe('VIA Right Panel', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;

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
          <VIARightPanel />
        </MuiThemeProvider>
      </Provider>,
    );
  });

  it('should render VIA Right Panel component', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should display "Create region" button', () => {
    const button = ui.getByTitle('Create a region');
    expect(button).toBeInTheDocument();
  });

  it('should create a region on button click', () => {
    const button = ui.getByTitle('Create a region');
    fireEvent.click(button);

    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(TYPES.CREATE_VIA_REGION);
  });

  it('should display "assemble" button', () => {
    const button = ui.getByText('Assemble');
    expect(button).toBeInTheDocument();
  });

  it('should continue image recognizing on button click', () => {
    const button = ui.getByText('Assemble');
    fireEvent.click(button);

    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(TYPES.ASSEMBLE_VIA_REGIONS);
  });

  it('should cancel annotation mode on button click', () => {
    const button = ui.getByText('Cancel');
    fireEvent.click(button);

    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(TYPES.CANCEL_RECOGNIZING);
  });
});
