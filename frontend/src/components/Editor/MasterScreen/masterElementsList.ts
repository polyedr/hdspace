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
import { ProjectDataState } from '@Redux/types';

const MASTER_ELEMENTS_LIST: ProjectDataState['masterScreen']['elements'] = {
  root: {
    ...root,
    name: 'Master Root',
    children: [
      'button',
      'heading',
      'hyperlink',
      'paragraph',
      'textBlock',
      'list',
      'textinput',
      'checkbox',
      'radiobutton',
      'label',
      'textarea',
      'container',
      'grid',
      'columns',
      'nativeColumns',
      'image',
      'video',
      'undefined',
      'section',
    ],
    id: 'masterRoot',
  },
  heading: {
    ...makeHeading(),
    name: 'Master Heading',
    id: 'masterHeading',
  },
  hyperlink: {
    ...hyperlink,
    name: 'Master Hyperlink',
    id: 'masterHyperlink',
  },
  paragraph: {
    ...makeParagraph(),
    name: 'Master Paragraph',
    id: 'masterParagraph',
  },
  textBlock: {
    ...textBlock,
    name: 'Master TextBlock',
    id: 'masterTextBlock',
  },
  list: {
    ...list,
    name: 'Master List',
    id: 'masterList',
    children: ['listItem'],
  },
  listItem: {
    ...makeListItem('Master ListItem'),
    name: 'Master ListItem',
    id: 'masterListItem',
  },
  button: {
    ...makeButton(),
    name: 'Master Button',
    id: 'masterButton',
  },
  textinput: {
    ...makeTextinput(),
    name: 'Master Textinput',
    id: 'masterTextinput',
  },
  checkbox: {
    ...checkbox,
    name: 'Master checkbox',
    id: 'masterCheckbox',
  },
  radiobutton: {
    ...radiobutton,
    name: 'Master Radiobutton',
    id: 'masterRadiobutton',
  },
  // select,
  label: {
    ...makeLabel(),
    name: 'Master Label',
    id: 'masterLabel',
  },
  textarea: {
    ...textarea,
    name: 'Master Textarea',
    id: 'masterTextarea',
  },
  container: {
    ...makeContainer(),
    name: 'Master Container',
    id: 'masterContainer',
  },
  grid: {
    ...makeGrid(),
    name: 'Master Grid',
    id: 'masterGrid',
    children: ['gridItem'],
  },
  gridItem: {
    ...makeGridItem(),
    name: 'Master GridItem',
    id: 'masterGridItem',
  },
  columns: {
    ...makeColumns(),
    name: 'Master Columns',
    id: 'masterColumns',
    children: ['column'],
  },
  column: {
    ...column,
    name: 'Master Column',
    id: 'masterColumn',
  },
  nativeColumns: {
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
  image: {
    ...makeImage(),
    name: 'Master Image',
    id: 'masterImage',
  },
  // dropdown,
  video: {
    ...video,
    name: 'Master Video',
    id: 'masterVideo',
  },
  undefined: {
    ...undefinedElement,
    name: 'Master Undefined',
    id: 'masterUndefined',
  },
  section: {
    ...section,
    name: 'Master Section',
    id: 'masterSection',
  },
};

export default MASTER_ELEMENTS_LIST;
