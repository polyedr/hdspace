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
    ...root,
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
    ...makeHeading(),
    name: 'Master Heading',
    id: 'masterHeading',
  },
  masterHyperlink: {
    ...hyperlink,
    name: 'Master Hyperlink',
    id: 'masterHyperlink',
  },
  masterParagraph: {
    ...makeParagraph(),
    name: 'Master Paragraph',
    id: 'masterParagraph',
  },
  masterTextBlock: {
    ...textBlock,
    name: 'Master TextBlock',
    id: 'masterTextBlock',
  },
  masterList: {
    ...list,
    name: 'Master List',
    id: 'masterList',
    children: ['masterListItem'],
  },
  masterListItem: {
    ...makeListItem('Master ListItem'),
    name: 'Master ListItem',
    id: 'masterListItem',
  },
  masterButton: {
    ...makeButton(),
    name: 'Master Button',
    id: 'masterButton',
  },
  masterTextinput: {
    ...makeTextinput(),
    name: 'Master Textinput',
    id: 'masterTextinput',
  },
  masterCheckbox: {
    ...checkbox,
    name: 'Master checkbox',
    id: 'masterCheckbox',
  },
  masterRadiobutton: {
    ...radiobutton,
    name: 'Master Radiobutton',
    id: 'masterRadiobutton',
  },
  // select,
  masterLabel: {
    ...makeLabel(),
    name: 'Master Label',
    id: 'masterLabel',
  },
  masterTextarea: {
    ...textarea,
    name: 'Master Textarea',
    id: 'masterTextarea',
  },
  masterContainer: {
    ...makeContainer(),
    name: 'Master Container',
    id: 'masterContainer',
  },
  masterGrid: {
    ...makeGrid(),
    name: 'Master Grid',
    id: 'masterGrid',
    children: ['masterGridItem'],
  },
  masterGridItem: {
    ...makeGridItem(),
    name: 'Master GridItem',
    id: 'masterGridItem',
  },
  masterColumns: {
    ...makeColumns(),
    name: 'Master Columns',
    id: 'masterColumns',
    children: ['masterColumn'],
  },
  masterColumn: {
    ...column,
    name: 'Master Column',
    id: 'masterColumn',
  },
  masterNativeColumns: {
    ...nativeColumns,
    name: 'Master Native Columns',
    id: 'masterNativeColumns',
  },
  // divBlock: {
  //   ...makeDivBlock,
  //   children: [?],
  //   name: 'Master DivBlock',
  //   id: 'masterDivBlock',
  // }
  masterImage: {
    ...makeImage(),
    name: 'Master Image',
    id: 'masterImage',
  },
  // dropdown,
  masterVideo: {
    ...video,
    name: 'Master Video',
    id: 'masterVideo',
  },
  masterUndefined: {
    ...undefinedElement,
    name: 'Master Undefined',
    id: 'masterUndefined',
  },
  masterSection: {
    ...section,
    name: 'Master Section',
    id: 'masterSection',
  },
};

export default MASTER_ELEMENTS_LIST;
