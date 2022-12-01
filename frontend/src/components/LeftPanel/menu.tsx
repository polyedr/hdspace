import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { AddCircleOutline, LayersOutlined } from '@mui/icons-material';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import React from 'react';
import Navigator from './Navigator';
import Screens from './Screens';

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

export default [
  {
    id: 'elements-tab',
    icon: AddCircleOutline,
    component: () => <RenderElementGrid elements={elements} />,
  },
  {
    id: 'screens',
    icon: AddCircleOutline,
    component: Screens,
  },
  {
    id: 'layers-tab',
    icon: LayersOutlined,
    component: Navigator,
  },
  {
    id: 'templates',
    icon: LayersOutlined,
    component: () => (
      <ElementsBlock title="Templates" elements={templates} expandable />
    ),
  },
  {
    id: 'generators',
    icon: LayersOutlined,
    component: () => (
      <ElementsBlock title="Generators" elements={generators} expandable />
    ),
  },
  {
    id: 'libraries',
    icon: LayersOutlined,
    component: () => <RenderElementGrid elements={library} />,
  },
];
