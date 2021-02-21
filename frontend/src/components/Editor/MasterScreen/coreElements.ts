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
  video,
  undefined as undefinedElement,
  // root,
} from '@Domain/libraryElements/otherElements/otherElements';
import {
  hyperlink,
  list,
  makeHeading,
  makeListItem,
  makeParagraph,
  textBlock,
} from '@Domain/libraryElements/typographyElements/typographyElements';
import { capitalize } from '@material-ui/core';
import { Entity, ServerElement } from '@Src/types';

const CORE_MASTER_RESPONSE_ELEMENTS = [
  makeHeading(),
  hyperlink,
  makeParagraph(),
  textBlock,
  list,
  makeListItem(),
  makeButton(),
  makeTextinput(),
  checkbox,
  radiobutton,
  makeLabel(),
  textarea,
  makeContainer(),
  makeGrid(),
  makeGridItem(),
  makeColumns(),
  column,
  nativeColumns,
  makeImage(),
  video,
  undefinedElement,
  section,
];

export const CORE_MASTER_ELEMENTS = CORE_MASTER_RESPONSE_ELEMENTS.map(
  (el: ServerElement<Entity>) => ({
    ...convertElementFromResponse(el),
    name: `Master ${capitalize(el.name)}`,
  }),
);

export const CORE_ROOT_CONTAINER = convertElementFromResponse(
  makeContainer({ name: 'Master Core Elements', UID: 'master-core-elements' }),
);

export const CORE_GROUPS_CONTAINER = convertElementFromResponse(
  makeContainer({ name: 'Master Groups', UID: 'master-groups' }),
);
