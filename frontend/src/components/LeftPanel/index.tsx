import React, { useMemo, useState } from 'react';
import { Stack, Box, styled, Typography, ButtonBase } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LIBRARY_ELEMENTS } from '@Domain/libraryElements/libraryElements';
import { createElementsHierarchy } from '@Utils/elementsHierarchy';
import ElementsBlock from '@Components/RightPanel/ElementsTab/ElementsBlock';
import Navigator from './Navigator';
import Screens from './Screens';
import {
  ElementsIcon,
  ComponentIcon,
  StylesIcon,
  LayersIcon,
  ScreensIcon,
  LibraryIcon,
} from './icons';

const RenderElementGrid = ({ elements }: { elements: object }) => {
  return (
    <>
      {Object.entries(elements).map(([key, value]) => (
        <ElementsBlock key={key} title={key} elements={value} expandable />
      ))}
    </>
  );
};
const IconButton = styled(ButtonBase)<{ active: boolean }>(
  ({ active, theme }) => ({
    width: theme.spacing(9),
    // height: 50,
    padding: 4,
    flexDirection: 'column',
    opacity: active ? 1 : 0.6,

    '& path': {
      fill: active ? 'black' : '',
    },

    '& h5': {
      color: active ? 'black' : '#838995',
    },
  }),
);

const IconsStack = styled(Stack)({
  backgroundColor: 'white',
  borderRight: '1px solid #E4E6EB',
});

const LeftSideBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const { elements, templates, generators, library } =
    createElementsHierarchy(LIBRARY_ELEMENTS);

  const menu = useMemo(() => {
    return [
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
        id: 'templates',
        label: 'Templates',
        icon: LayersIcon,
        component: () => (
          <ElementsBlock title="Templates" elements={templates} expandable />
        ),
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
        <IconsStack spacing={1} sx={{ pt: 3 }}>
          {menu.map(({ id, icon: Icon, label }) => (
            <IconButton
              active={activeMenu === id}
              key={id}
              onClick={() => setActiveMenu(id)}
            >
              <Icon />
              <Typography variant="h5" fontSize={12}>
                {label}
              </Typography>
            </IconButton>
          ))}
        </IconsStack>
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
