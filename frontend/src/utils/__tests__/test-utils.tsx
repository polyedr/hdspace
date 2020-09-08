import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from '../../redux/store';

const render = (
  ui: ReactElement,
  {
    initialState = {},
    store = createStore(rootReducer, initialState),
    ...renderOptions
  } = {},
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );
  return rtlRender(ui, {
    wrapper: Wrapper as RenderOptions['wrapper'],
    ...renderOptions,
  });
};

export * from '@testing-library/react';

export { render };
