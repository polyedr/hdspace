import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import React from 'react';
import Navigator from './Navigator';
import Screens from './Screens';
import {
  ElementsIcon,
  ComponentIcon,
  StylesIcon,
  ScreensIcon,
  LibraryIcon,
} from './icons';
import LibraryMenu from './LibraryMenu';

const { elements, templates, generators, library } =
  createElementsHierarchy(LIBRARY_ELEMENTS);

const RenderElementGrid = ({ elements }: { elements: object }) => {
  return (
    <>
      {Object.entries(elements).map(([key, value]) => (
        <ElementsBlock key={key} title={key} elements={value} expandable />
      ))}
    </>
  );
};

export const mainMenu = [
  {
    id: 'elements-tab',
    label: 'Elements',
    icon: ElementsIcon,
    component: () => <RenderElementGrid elements={elements} />,
  },
  {
    id: 'screens',
    label: 'Screens',
    icon: ComponentIcon,
    component: Screens,
  },
  {
    id: 'layers-tab',
    label: 'Layers',
    icon: StylesIcon,
    component: Navigator,
  },
  {
    id: 'generators',
    label: 'Generators',
    icon: ScreensIcon,
    component: () => (
      <ElementsBlock title="Generators" elements={generators} expandable />
    ),
  },
  {
    id: 'libraries',
    label: 'Libraries',
    icon: LibraryIcon,
    component: () => <LibraryMenu library={library} templates={templates} />,
  },
  // {
  //   id: 'libraries',
  //   label: 'Libraries',
  //   icon: LibraryIcon,
  //   component: () => <RenderElementGrid elements={library} />,
  // },
];
