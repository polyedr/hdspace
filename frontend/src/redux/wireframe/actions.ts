import { createAction } from '@reduxjs/toolkit';
import TYPES from '@/redux/actionTypes';
import { ScreenData } from '@Src/types';

interface UpdateScreenData {
  screen: ScreenData;
  position: { x: number; y: number };
}

export const updateScreenPosition = createAction(
  TYPES.WIREFRAME_UPDATE_SCREEN_DATA,
  function prepare(data: UpdateScreenData) {
    return {
      payload: {
        screen: data.screen,
        data: {
          ...data.screen,
        },
      },
    };
  },
);
