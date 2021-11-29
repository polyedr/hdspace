import TYPES from '@Redux/actionTypes';
import {
  RequestTask,
  UpdateCardIndexType,
  UpdateCardIndexTypeSuccess,
} from '@Src/types/pmtools/actions';
import { ActionTypePM } from '@Src/types/pmtools/types';

export const requestUpdateCardIndex = ({
  destination,
  source,
}: UpdateCardIndexType) => ({
  type: TYPES.UPDATE_CARD_INDEX,
  payload: { destination, source },
});

export const successUpdateCardIndex = ({
  dest,
  removed,
  destList,
  source,
  sourceList,
}: UpdateCardIndexTypeSuccess) => ({
  type: TYPES.UPDATE_CARD_INDEX_SUCCESS,
  payload: { dest, removed, destList, source, sourceList },
});

export const requestAddTask = (
  payload: RequestTask & { action: ActionTypePM } & { email: string },
) => ({
  type: TYPES.ADD_TASK,
  payload,
});

export const requestEditTask = (payload: any) => ({
  type: TYPES.EDIT_TASK,
  payload,
});

export const requestDeleteTask = (
  payload: { taskId: string } & { action: ActionTypePM },
) => ({
  type: TYPES.DELETE_TASK,
  payload,
});

export const requestDeleteMemberTask = (payload: {
  cardId: string;
  userId: string;
}) => ({
  type: TYPES.DELETE_MEMBER_TASK,
  payload,
});

// SUCCESS
export const successFetchTask = (payload: any) => ({
  type: TYPES.FETCH_TASKS_SUCCESS,
  payload,
});

export const successFetchMembers = (payload: Array<any>) => ({
  type: TYPES.MEMBERS_SAVED_SUCCESS,
  payload,
});

export const successAddTask = (payload: any) => ({
  type: TYPES.ADD_TASK_SUCCESS,
  payload,
});

export const successEditTask = (payload: any) => ({
  type: TYPES.EDIT_TASK_SUCCESS,
  payload,
});

export const successDeleteTask = (payload: any) => ({
  type: TYPES.DELETE_TASK_SUCCESS,
  payload,
});
