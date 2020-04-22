import { IScenarioElement } from '$redux/project/types';

export const getSavedValue = (element: IScenarioElement) => {
  switch (element.struct_type) {
    case 'textinput': {
      return element.parameters.textContent || '';
    }

    case 'checkbox': {
      return element.parameters.defaultChecked || '';
    }

    default: {
      return element.parameters.value || '';
    }
  }
};
