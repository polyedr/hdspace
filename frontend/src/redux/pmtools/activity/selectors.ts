import { ActivityRootState } from '../types';

const selectActions = (state: ActivityRootState) => state.activity.actions;

export default selectActions;
