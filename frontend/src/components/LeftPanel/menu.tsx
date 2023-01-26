import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import React from 'react';
import Scrollbar from '@Components/UI/Scrollbar';
import { useSelector } from 'react-redux';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import FrameworkSection from '@Components/RightPanel/FrameworkSection';
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
import Styles from './Styles';
import VIANavigator from './VIANavigator';

const { elements, templates, generators, library } =
  createElementsHierarchy(LIBRARY_ELEMENTS);

function RenderElementGrid({ elements }: { elements: object }) {
  return (
    <>
      {Object.entries(elements).map(([key, value]) => (
        <ElementsBlock key={key} title={key} elements={value} expandable />
      ))}
    </>
  );
}

function Layers() {
  const viaMode = useSelector(selectVIAModeEnabled);
  return viaMode ? <VIANavigator /> : <Navigator />;
}

export const mainMenu = [
  {
    id: 'elements-tab',
    label: 'Elements',
    icon: ElementsIcon,
    component: () => (
      <Scrollbar>
        <RenderElementGrid elements={elements} />
      </Scrollbar>
    ),
  },
  {
    id: 'screens',
    label: 'Screens',
    icon: ComponentIcon,
    component: Screens,
  },
  {
    id: 'styles',
    label: 'Styles',
    icon: ComponentIcon,
    component: () => (
      <Scrollbar>
        <FrameworkSection />
        <Styles />
      </Scrollbar>
    ),
  },
  {
    id: 'layers-tab',
    label: 'Layers',
    icon: StylesIcon,
    component: Layers,
  },
  {
    id: 'generators',
    label: 'Generators',
    icon: ScreensIcon,
    component: () => (
      <Scrollbar>
        <ElementsBlock title="Generators" elements={generators} expandable />
      </Scrollbar>
    ),
  },
  {
    id: 'libraries',
    label: 'Library',
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
