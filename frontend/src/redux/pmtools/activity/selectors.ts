import { ActivityRootState } from '../types';

const selectActions = (state: ActivityRootState) =>
  state.activityReducer.actions;

export default selectActions;
