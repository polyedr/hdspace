import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ProjectsSearchParameter } from '@Src/types';
import { AppThemeProvider } from '@Src/styles/Theme';
import { mockState } from '../../test-utils';
import { AppReduxState } from '../../../../redux/types';
import TYPES from '../../../../redux/actionTypes';
import Searchbar from '../../../../components/Projects/Searchbar';

describe('Searchbar', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;

  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    ui = render(
      <MemoryRouter><Provider store={store}>
        <AppThemeProvider>
          <Searchbar />
        </AppThemeProvider>
      </Provider></MemoryRouter>,
    );
  });

  it('should render a searchbar', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should have a search field', () => {
    const input = ui.getByLabelText('Search project');
    expect(input).toBeInTheDocument();
  });

  it('should have a parameter name field', () => {
    const input = ui.getByLabelText('Search by', {
      selector: 'input',
    });
    expect(input).toBeInTheDocument();
  });

  it('should change a parameter value on input change', () => {
    const testValue = 'test';

    const input = ui.getByLabelText('Search project');
    fireEvent.change(input, {
      target: {
        value: testValue,
      },
    });
    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(
      TYPES.SET_PROJECT_SEARCH_PARAMETER,
    );
    expect(actions[actions.length - 1].payload[1]).toBe(testValue);
  });

  it('should change a parameter name on input change', () => {
    const testValue = ProjectsSearchParameter.status;

    const input = ui.getByLabelText('Search by', {
      selector: 'input',
    });
    fireEvent.change(input, {
      target: {
        value: testValue,
      },
    });

    const actions = store.getActions();
    expect(actions[actions.length - 1].type).toBe(
      TYPES.SET_PROJECT_SEARCH_PARAMETER,
    );
    expect(actions[actions.length - 1].payload[0]).toBe(testValue);
  });
});
