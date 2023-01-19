import { WireframeConnection, WireframeState } from '@Redux/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeScreen: undefined,
  activeElement: undefined,
  connections: [],
} as WireframeState;

const wireframeSlice = createSlice({
  initialState,
  name: 'wireframe',
  reducers: {
    setActiveScreen(state, action: PayloadAction<number>) {
      state.activeScreen = action.payload;
    },
    setActiveElement(state, action: PayloadAction<number>) {
      state.activeElement = action.payload;
    },
    addConnection(state, action: PayloadAction<WireframeConnection>) {
      const existingConnectionIndex = state.connections.findIndex(
        (c) =>
          c.sourceElement === action.payload.sourceElement &&
          c.destinationScreem &&
          action.payload.destinationScreem,
      );

      // update connectionn if already exists
      if (existingConnectionIndex !== -1) {
        state[existingConnectionIndex] = action.payload;
      } else {
        // push new connection
        state.connections.push(action.payload);
      }
    },
  },
});

export const { setActiveScreen, setActiveElement } = wireframeSlice.actions;

export default wireframeSlice.reducer;
