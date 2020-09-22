import { LibraryElementUnion } from '../api/types';
import { StateElement } from '../redux/project/types';

const getSavedValue = (element: LibraryElementUnion | StateElement) => {
  switch (element.type) {
    case 'textarea':
    case 'textinput': {
      return element.parameters.textContent || '';
    }

    case 'checkbox': {
      return element.parameters.defaultChecked || '';
    }

    case 'radiobutton':
    case 'select': {
      return element.parameters.value;
    }

    default: {
      return '';
    }
  }
};

export default getSavedValue;
