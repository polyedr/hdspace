import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { vi } from 'vitest';
import { mockState } from '@Utils/__tests__/test-utils';
import { AppReduxState } from '@Redux/types';
import TYPES from '@Redux/actionTypes';
import ImageRecognizeForm from '@Components/Dialogs/NewScreenModal/ImageRecognizeForm';
import { AppThemeProvider } from '@Src/styles/Theme';

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(),
});

describe('ImageRecognizeForm', () => {
  let store: MockStoreEnhanced<AppReduxState>;

  let ui: RenderResult;
  const closeCallback = vi.fn();
  const file = new File(['(⌐□_□)'], 'chucknorris.png', {
    type: 'image/png',
  });

  beforeEach(() => {
    const mockStore = configureStore<AppReduxState>([]);
    store = mockStore(mockState);

    ui = render(
      <MemoryRouter><Provider store={store}>
        <AppThemeProvider>
          <ImageRecognizeForm onClose={closeCallback} />
        </AppThemeProvider>
      </Provider></MemoryRouter>,
    );
  });
  it('should render properly', () => {
    expect(ui.container).toMatchSnapshot();
  });

  it('should close form on button click', () => {
    const closeButton = ui.getByText('Cancel');
    fireEvent.click(closeButton);

    expect(closeCallback).toHaveBeenCalled();
  });

  it('should upload an image on input click', () => {
    const input = ui.getByLabelText('Upload');
    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });
    const img = ui.getByAltText('uploaded');
    expect(img).toBeInTheDocument();
  });

  it('should have disabled confirm button if no file selected', () => {
    const button = ui.getByText('Create');
    expect(button).toBeDisabled();
  });

  it('should dispatch recognizeImage action of confirm', () => {
    const button = ui.getByText('Create');
    if (!button) throw new Error('Can not find button');
    const input = ui.getByLabelText('Upload');
    fireEvent.change(input, {
      target: {
        files: [file],
      },
    });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);

    const menuOption = ui.getByText('Semi Auto');

    fireEvent.click(menuOption);

    const actions = store.getActions();

    expect(actions[actions.length - 1].type).toBe(TYPES.RECOGNIZE_IMAGE);
  });
});
