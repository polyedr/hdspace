import reducer from './reducers';
import * as selectors from './selectors';
import * as T from './types';

export { reducer, selectors, T }; // TODO: rename T to ProjectT once and export everywhere, instead of naming T as ProjectT every time