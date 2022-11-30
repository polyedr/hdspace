import React, { useMemo, useState } from 'react';
import { IconButton, Stack, Box } from '@mui/material';
import { AddCircleOutline, LayersOutlined } from '@mui/icons-material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import Navigator from './Navigator';
import Screens from './Screens';

const RenderElementGrid = ({ elements }: { elements: object }) => {
  return (
    <>
      {Object.entries(elements).map(([key, value]) => (
        <ElementsBlock key={key} title={key} elements={value} expandable />
      ))}
    </>
  );
};

const LeftSideBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { elements, templates, generators, library } =
    createElementsHierarchy(LIBRARY_ELEMENTS);

  const menu = useMemo(() => {
    return [
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
  }, []);

  const ActiveComponent = activeMenu
    ? menu.find((m) => m.id === activeMenu)?.component
    : null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Stack direction="row">
        <Stack spacing={1}>
          {menu.map(({ id, icon: Icon }) => (
            <IconButton key={id} onClick={() => setActiveMenu(id)}>
              <Icon fontSize="large" />
            </IconButton>
          ))}
          <hr />
        </Stack>
        {ActiveComponent && (
          <Box width={248}>
            <ActiveComponent />
          </Box>
        )}
      </Stack>
    </DndProvider>
  );
};

export default LeftSideBar;
