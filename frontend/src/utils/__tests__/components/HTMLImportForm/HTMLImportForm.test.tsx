import React from 'react';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import HtmlImportForm from '@Components/Dialogs/NewScreenModal/HTMLImportForm';
import { vi } from 'vitest';
import { AppThemeProvider } from '@Src/styles/Theme';
// import TYPES from '@Redux/actionTypes';

describe('HTMLImportForm', () => {
  let store: MockStoreEnhanced<AppReduxState>;
  let ui: RenderResult;
  const closeCallback = vi.fn();

  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    ui = render(
      <Provider store={store}>
        <AppThemeProvider>
          <HtmlImportForm onClose={closeCallback} />
        </AppThemeProvider>
      </Provider>,
    );
  });

  it('should render properly', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should be displayed', () => {
    const formTitle = ui.getByText('Provide a URL');
    expect(formTitle).toBeInTheDocument();
  });

  it('should have a text input', () => {
    const input = ui.getByPlaceholderText('URL');
    expect(input).toBeInTheDocument();
  });

  it('should have a hidden file input', () => {
    const input = ui.getByLabelText('Click or drop file here to upload');
    expect(input).toBeInTheDocument();
  });

  it('submit button should be disabled if inputs are empty', () => {
    const textInput = ui.getByPlaceholderText('URL') as HTMLInputElement;
    const fileInput = ui.getByLabelText(
      'Click or drop file here to upload',
    ) as HTMLInputElement;

    expect(textInput.value).toBeFalsy();
    expect(fileInput.value).toBeFalsy();

    const submitButton = ui.getByText('Check Import Site');
    expect(submitButton).toBeDisabled();

    fireEvent.change(textInput, { target: { value: '123' } });
    expect(submitButton).toBeDisabled();
  });

  it('should trigger onClose callback when "Cancel" button is clicked', () => {
    expect(closeCallback).toHaveBeenCalledTimes(0);
    const closeButton = ui.getByText('Cancel');
    fireEvent.click(closeButton);
    expect(closeCallback).toHaveBeenCalledTimes(1);
  });
});

// describe('test', () => {
//   let store: MockStoreEnhanced<AppReduxState>;
//   let ui: RenderResult;
//   const closeCallback = jest.fn();

//   beforeEach(() => {
//     jest.useFakeTimers();
//     const mockStore = configureStore<AppReduxState>([]);
//     store = mockStore({
//       ...mockState,
//       project: {
//         ...mockState.project,
//         ui: { ...mockState.project.ui, isCanImportSite: true },
//       },
//     });

//     ui = render(
//       <Provider store={store}>
//         <HtmlImportForm onClose={closeCallback} />
//       </Provider>,
//     );
//   });

//   it('should dispatch an action on submit', () => {
//     const testValue = 'https://example.org';
//     const textInput = ui.getByPlaceholderText('URL');
//     fireEvent.change(textInput, { target: { value: testValue } });
//     const submitButton = ui.getByText('Create');
//     fireEvent.click(submitButton);
//     const actions = store.getActions();
//     expect(actions[0].type).toBe(TYPES.UPLOAD_IMPORT_URL);
//     expect(actions[0].payload).toBe(testValue);
//   });

//   it('should start process a url in case of both inputs are filled', () => {
//     const file = new File(['(⌐□_□)'], 'chucknorris.png', {
//       type: 'image/png',
//     });
//     const string = '42';
//     const textInput = ui.getByPlaceholderText('URL');
//     const fileInput = ui.getByLabelText('Click or drop file here to upload');
//     const submitButton = ui.getByText('Create');

//     fireEvent.change(textInput, { target: { value: string } });
//     fireEvent.change(fileInput, {
//       target: { files: [file] },
//     });

//     fireEvent.click(submitButton);
//     const actions = store.getActions();
//     expect(actions[0].type).toBe(TYPES.ENQUEUE_SNACKBAR);
//     expect(actions[0].payload).toBe(string);
//   });
// });
