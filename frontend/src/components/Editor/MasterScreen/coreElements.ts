import { convertElementFromResponse } from '@Api/converters/fromResponse';
import { makeSection } from '@Domain/libraryElements/blocksTemplates/blocksTemplates';
import {
  makeCheckbox,
  makeButton,
  makeLabel,
  makeRadiobutton,
  makeTextinput,
  makeTextarea,
} from '@Domain/libraryElements/formElements/formElements';
import {
  makeColumn,
  makeColumns,
  makeContainer,
  makeGrid,
  makeGridItem,
  makeImage,
  makeNativeColumns,
  makeVideo,
} from '@Domain/libraryElements/otherElements/otherElements';
import {
  makeHeading,
  makeList,
  makeListItem,
  makeParagraph,
  makeTextBlock,
} from '@Domain/libraryElements/typographyElements/typographyElements';
import { capitalize } from '@mui/material/utils';
import { Entity, ServerElement } from '@Src/types';

const CORE_MASTER_RESPONSE_ELEMENTS = [
  makeHeading(),
  makeParagraph(),
  makeTextBlock(),
  makeList({ items: [makeListItem({ buoyancy: 0 })] }),
  makeButton(),
  makeTextinput(),
  makeCheckbox(),
  makeRadiobutton(),
  makeLabel(),
  makeTextarea(),
  makeContainer(),
  makeGrid({ items: [makeGridItem()] }),
  makeColumns(),
  makeColumn(),
  makeNativeColumns(),
  makeImage(),
  makeVideo(),
  makeSection(),
];

const getMasterElementsIds = (
  elements: Array<ServerElement<Entity>>,
): string[] =>
  elements.reduce<string[]>(
    (allIds: string[], el: ServerElement<Entity>) => [
      ...allIds,
      ...getMasterElementsIds(el.children as Array<ServerElement<Entity>>),
      el.id.toString(),
    ],
    [],
  );

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
