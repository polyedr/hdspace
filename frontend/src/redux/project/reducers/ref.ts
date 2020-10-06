import { initialUi } from '../initial';
import * as T from '../types';
import TYPES from '../../../constants/actions';

const refReducer = (
  state: T.ProjectUiState & T.RefsUIState = initialUi,
  action: T.Action,
): T.RefsUIState => {
  switch (action.type) {
    case TYPES.ADD_BORDERED_ELEMENT_REF: {
      return {
        ...state,
        borderedElementsRef: {
          ...state.borderedElementsRef,
          [action.payload.id]: action.payload.ref,
        },
      };
    }

    case TYPES.REMOVE_BORDERED_ELEMENT_REF: {
      const newBorderedElementsRef = { ...state.borderedElementsRef };
      delete newBorderedElementsRef[action.payload.id];
      return {
        ...state,
        borderedElementsRef: newBorderedElementsRef,
      };
    }
    default: {
      return state;
    }
  }
};

export default refReducer;
