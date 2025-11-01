import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const initialState = {
  activeScreen: undefined,
  activeElement: undefined,
};

const wireframeSlice = createSlice({
  initialState,
  name: 'wireframe',
  reducers: {
    setActiveScreen(state, action: PayloadAction<string>) {
      state.activeScreen = action.payload;
    },
    setActiveElement(state, action: PayloadAction<string>) {
      state.activeElement = action.payload;
    },
  },
});

export const { setActiveScreen, setActiveElement } = wireframeSlice.actions;

export default wireframeSlice.reducer;
