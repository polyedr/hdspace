import TYPES from '@Redux/actionTypes';
import { HistoryMeta, ScreenPosition } from '@Redux/types';

export const updateScreenPosition = (
  screenId: number,
  position: ScreenPosition,
  projectId: number,
  meta: HistoryMeta = {},
) => ({
  type: TYPES.WIREFRAME_UPDATE_SCREEN_POSITION,
  payload: {
    screenId,
    projectId,
    position,
  },
  meta,
});
