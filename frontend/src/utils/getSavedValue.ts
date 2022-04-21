import { LibraryElementUnion, StateElement } from '@Src/types';

const getSavedValue = (element: LibraryElementUnion | StateElement) => {
  switch (element.type) {
    case 'textarea':
    case 'textinput': {
      return element.parameters.textContent || '';
    }

    case 'switch':
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
