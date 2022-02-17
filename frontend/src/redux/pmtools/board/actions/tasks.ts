import TYPES from '@Redux/actionTypes';
import { IServerTaskData, ITaskData } from '@Src/types/pmtools/board';
import {
  ActionTypePM,
  UpdateCardIndexType,
  UpdateCardIndexTypeSuccess,
} from '@Src/types/pmtools/types';
import { ServerProject } from '@Src/types';

export type AddTaskType = {
  id: IServerTaskData['id'];
  project: ServerProject['id'];
  email: string;
  action: ActionTypePM;
  name: IServerTaskData['name'];
};

export const requestUpdateCardIndex = ({
  destination,
  source,
}: UpdateCardIndexType) => ({
  type: TYPES.UPDATE_CARD_INDEX,
  payload: { destination, source },
});

export const successUpdateCardIndex = (
  payload: UpdateCardIndexTypeSuccess,
) => ({
  type: TYPES.UPDATE_CARD_INDEX_SUCCESS,
  payload,
});

export const requestAddTask = (payload: AddTaskType) => ({
  type: TYPES.ADD_TASK,
  payload,
});

export const requestEditTask = (payload: AddTaskType) => ({
  type: TYPES.EDIT_TASK,
  payload,
});

export const requestDeleteTask = (
  payload: { taskId: ITaskData['id'] } & { action: ActionTypePM },
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
