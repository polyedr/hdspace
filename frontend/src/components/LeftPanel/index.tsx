import React, { useState } from 'react';
import { Stack, Box, styled, Typography, ButtonBase } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import menu from './menu';

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
