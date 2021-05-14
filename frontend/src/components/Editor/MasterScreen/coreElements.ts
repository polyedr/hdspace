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
  undefinedElement,
} from '@Domain/libraryElements/otherElements/otherElements';
import {
  hyperlink,
  makeHeading,
  makeList,
  makeListItem,
  makeParagraph,
  textBlock,
} from '@Domain/libraryElements/typographyElements/typographyElements';
import { capitalize } from '@material-ui/core/utils';
import { Entity, ServerElement } from '@Src/types';

const CORE_MASTER_RESPONSE_ELEMENTS = [
  makeHeading(),
  hyperlink,
  makeParagraph(),
  textBlock,
  makeList({ items: [makeListItem({ buoyancy: 0 })] }),
  makeButton(),
  makeTextinput(),
  checkbox,
  radiobutton,
  makeLabel(),
  textarea,
  makeContainer(),
  makeGrid({ items: [makeGridItem()] }),
  makeColumns(),
  column,
  nativeColumns,
  makeImage(),
  video,
  undefinedElement,
  section,
];

const getMasterElementsIds = (elements: ServerElement<Entity>[]): string[] => {
  return elements.reduce((allIds: string[], el: ServerElement<Entity>) => {
    return [
      ...allIds,
      ...getMasterElementsIds(el.children as ServerElement<Entity>[]),
      el.id.toString(),
    ];
  }, [] as string[]);
};

const CORE_MASTER_ELEMENTS_IDS = getMasterElementsIds(
  CORE_MASTER_RESPONSE_ELEMENTS,
);

const CORE_MASTER_ELEMENTS = CORE_MASTER_RESPONSE_ELEMENTS.map(
  (el: ServerElement<Entity>) => ({
    ...convertElementFromResponse(el),
    name: `Master ${capitalize(el.name)}`,
  }),
);

export { CORE_MASTER_ELEMENTS_IDS, CORE_MASTER_ELEMENTS };
