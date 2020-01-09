import reducer from './reducers';
import * as selectors from './selectors';
import * as actionsCreators from './actions';
import * as T from './types';

export { reducer, selectors, actionsCreators, T }; // TODO: rename T to ProjectT once and export everywhere, instead of naming T as ProjectT every time