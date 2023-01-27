import { WireframeConnection, WireframeState } from '@Redux/types';
import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  activeScreen: undefined,
  activeElement: undefined,
  connections: [],
} as WireframeState;

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
    addConnection: {
      reducer: (state, action: PayloadAction<WireframeConnection>) => {
        state.connections.push(action.payload);
      },
      prepare: (
        connection: Pick<WireframeConnection, 'sourceElement' | 'screenId'>,
      ) => {
        return {
          payload: {
            event: '',
            destinationScreen: '',
            sourceElement: '',
            ...connection,
            id: nanoid(),
          },
        };
      },
    },
    updateConnection(state, action: PayloadAction<WireframeConnection>) {
      const existingConnectionIndex = state.connections.findIndex(
        (c) => c.id === action.payload.id,
      );

      // update connectionn if already exists
      if (existingConnectionIndex !== -1) {
        state.connections[existingConnectionIndex] = action.payload;
      }
    },
  },
});

export const {
  setActiveScreen,
  setActiveElement,
  addConnection,
  updateConnection,
} = wireframeSlice.actions;

export default wireframeSlice.reducer;
