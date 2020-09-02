import { LibraryElementUnion } from '../api/types';

const getSavedValue = (element: LibraryElementUnion) => {
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
