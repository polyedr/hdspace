import React, { useMemo, useState } from 'react';
import { IconButton, Stack, Box } from '@mui/material';
import { AddCircleOutline, LayersOutlined } from '@mui/icons-material';
import ElementsTab from '@Components/RightPanel/ElementsTab';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navigator from './Navigator';
import Screens from './Screens';

const LeftSideBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menu = useMemo(() => {
    return [
      {
        id: 'elements-tab',
        icon: AddCircleOutline,
        component: ElementsTab,
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
