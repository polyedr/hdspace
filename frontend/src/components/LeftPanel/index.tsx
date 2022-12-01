import React, { useState } from 'react';
import { IconButton, Stack, Box } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import menu from './menu';

const LeftSideBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
