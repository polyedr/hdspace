import { convertElementFromResponse } from '@Api/converters/fromResponse';
import { section } from '@Domain/libraryElements/blocksTemplates/blocksTemplates';
import {
  checkbox,
  makeButton,
  makeLabel,
  makeTextinput,
  radiobutton,
  textarea,
} from '@Domain/libraryElements/formElements/formElements';
import {
  column,
  makeColumns,
  makeContainer,
  makeGrid,
  makeGridItem,
  makeImage,
  nativeColumns,
  root,
  video,
  undefined as undefinedElement,
} from '@Domain/libraryElements/otherElements/otherElements';
import {
  hyperlink,
  list,
  makeHeading,
  makeListItem,
  makeParagraph,
  textBlock,
} from '@Domain/libraryElements/typographyElements/typographyElements';

const MASTER_ELEMENTS_LIST = {
  masterRoot: {
    ...convertElementFromResponse(root),
    name: 'Master Root',
    children: [
      'masterButton',
      'masterHeading',
      'masterHyperlink',
      'masterParagraph',
      'masterTextBlock',
      'masterList',
      'masterTextinput',
      'masterCheckbox',
      'masterRadiobutton',
      'masterLabel',
      'masterTextarea',
      'masterContainer',
      'masterGrid',
      'masterColumns',
      'masterNativeColumns',
      'masterImage',
      'masterVideo',
      'masterUndefined',
      'masterSection',
    ],
    id: 'masterRoot',
  },
  masterHeading: {
    ...convertElementFromResponse(makeHeading()),
    name: 'Master Heading',
    id: 'masterHeading',
  },
  masterHyperlink: {
    ...convertElementFromResponse(hyperlink),
    name: 'Master Hyperlink',
    id: 'masterHyperlink',
  },
  masterParagraph: {
    ...convertElementFromResponse(makeParagraph()),
    name: 'Master Paragraph',
    id: 'masterParagraph',
  },
  masterTextBlock: {
    ...convertElementFromResponse(textBlock),
    name: 'Master TextBlock',
    id: 'masterTextBlock',
  },
  masterList: {
    ...convertElementFromResponse(list),
    name: 'Master List',
    id: 'masterList',
    children: ['masterListItem'],
  },
  masterListItem: {
    ...convertElementFromResponse(makeListItem('Master ListItem')),
    name: 'Master ListItem',
    id: 'masterListItem',
  },
  masterButton: {
    ...convertElementFromResponse(makeButton()),
    name: 'Master Button',
    id: 'masterButton',
  },
  masterTextinput: {
    ...convertElementFromResponse(makeTextinput()),
    name: 'Master Textinput',
    id: 'masterTextinput',
  },
  masterCheckbox: {
    ...convertElementFromResponse(checkbox),
    name: 'Master checkbox',
    id: 'masterCheckbox',
  },
  masterRadiobutton: {
    ...convertElementFromResponse(radiobutton),
    name: 'Master Radiobutton',
    id: 'masterRadiobutton',
  },
  // select,
  masterLabel: {
    ...convertElementFromResponse(makeLabel()),
    name: 'Master Label',
    id: 'masterLabel',
  },
  masterTextarea: {
    ...convertElementFromResponse(textarea),
    name: 'Master Textarea',
    id: 'masterTextarea',
  },
  masterContainer: {
    ...convertElementFromResponse(makeContainer()),
    name: 'Master Container',
    id: 'masterContainer',
  },
  masterGrid: {
    ...convertElementFromResponse(makeGrid()),
    name: 'Master Grid',
    id: 'masterGrid',
    children: ['masterGridItem'],
  },
  masterGridItem: {
    ...convertElementFromResponse(makeGridItem()),
    name: 'Master GridItem',
    id: 'masterGridItem',
  },
  masterColumns: {
    ...convertElementFromResponse(makeColumns()),
    name: 'Master Columns',
    id: 'masterColumns',
    children: ['masterColumn'],
  },
  masterColumn: {
    ...convertElementFromResponse(column),
    name: 'Master Column',
    id: 'masterColumn',
  },
  masterNativeColumns: {
    ...convertElementFromResponse(nativeColumns),
    name: 'Master Native Columns',
    id: 'masterNativeColumns',
  },
  masterImage: {
    ...convertElementFromResponse(makeImage()),
    name: 'Master Image',
    id: 'masterImage',
  },
  // dropdown,
  masterVideo: {
    ...convertElementFromResponse(video),
    name: 'Master Video',
    id: 'masterVideo',
  },
  masterUndefined: {
    ...convertElementFromResponse(undefinedElement),
    name: 'Master Undefined',
    id: 'masterUndefined',
  },
  masterSection: {
    ...convertElementFromResponse(section),
    name: 'Master Section',
    id: 'masterSection',
  },
};

export default MASTER_ELEMENTS_LIST;
