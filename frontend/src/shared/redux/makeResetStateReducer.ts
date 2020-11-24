import { IPlainAction } from '@Redux/types';

function makeResetStateReducer<A extends IPlainAction<string>, S>(
  type: A['type'],
  initialState: S | undefined,
) {
  return (state: S, action: A) =>
    action.type === type ? (initialState as S) : state;
}

export default makeResetStateReducer;
