import React, { useCallback, useState } from 'react';
import { Stack, Box, styled, Typography, ButtonBase } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Scrollbars from 'react-custom-scrollbars';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { mainMenu } from './menu';
import { SettingIcon } from './icons';

const IconButton = styled(ButtonBase)<{ active: boolean }>(
  ({ active, theme }) => ({
    width: theme.spacing(9),
    // height: 50,
    padding: 4,
    flexDirection: 'column',
    opacity: active ? 1 : 0.6,
    margin: '0 !important',

    '& svg': {
      height: 30,
    },

    '& path': {
      fill: active ? 'black' : '',
    },

    '& h5': {
      color: active ? 'black' : '#838995',
    },

    label: {
      color: '#838995',
      fontSize: 12,
    },
  }),
);

const Boxstacked = styled(Box)({
  backgroundColor: 'white',
  borderRight: '1px solid #E4E6EB',
  padding: '10px 0',
  display: 'flex',
  flexDirection: 'column',

  '&  hr': {
    width: '70%',
    margin: '30px auto',
    border: 'none',
    borderTop: '1px solid #E4E6EB',
  },
});

const LeftSideBar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const ActiveComponent = activeMenu
    ? mainMenu.find((m) => m.id === activeMenu)?.component
    : null;

  const handleChangeMenu = useCallback(
    (menu) => {
      return () => {
        if (menu === activeMenu) {
          setActiveMenu(null);
        } else {
          setActiveMenu(menu);
        }
      };
    },
    [activeMenu],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Stack direction="row">
        <Boxstacked>
          <Stack spacing={1}>
            {mainMenu.map(({ id, icon: Icon, label }) => (
              <IconButton
                active={activeMenu === id}
                key={id}
                onClick={handleChangeMenu(id)}
              >
                <Icon />
                <Typography variant="h5" fontSize={12}>
                  {label}
                </Typography>
              </IconButton>
            ))}
          </Stack>
          <hr />
          <Stack flex={1} justifyContent="space-between">
            <Stack spacing={1}>
              <IconButton active={false}>
                <DashboardIcon />
                <label>Board</label>
              </IconButton>
              <IconButton active={false}>
                <DashboardIcon />
                <label>Chat</label>
              </IconButton>
              <IconButton active={false}>
                <DashboardIcon />
                <label>Team</label>
              </IconButton>
              <IconButton active={false}>
                <DashboardIcon />
                <label>Activities</label>
              </IconButton>
            </Stack>

            <IconButton active={false}>
              <SettingIcon />
              <label>Setting</label>
            </IconButton>
          </Stack>
        </Boxstacked>
        {ActiveComponent && (
          <Box width={248}>
            <Scrollbars>
              <ActiveComponent />
            </Scrollbars>
          </Box>
        )}
      </Stack>
    </DndProvider>
  );
};

export default LeftSideBar;
