import { useCallback, useState } from 'react';
import { Stack, Box, styled, Typography, ButtonBase } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '@Redux/project/actions';
import { selectSidebarOpen } from '@Redux/project/selectors/base';
import {
  SettingIcon,
  BoardIcon,
  ChatIcon,
  MemberIcon,
  ActivityIcon,
} from './icons';
import { mainMenu } from './menu';

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
      color: '#B0B0BD',
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

function LeftSideBar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const sidebarOpen = useSelector(selectSidebarOpen);
  const dispatch = useDispatch();

  const ActiveComponent = activeMenu
    ? mainMenu.find((m) => m.id === activeMenu)?.component
    : null;

  const handleSidebarToggle = useCallback(() => {
    dispatch(setSidebarOpen(!sidebarOpen));
  }, [sidebarOpen]);

  const handleChangeMenu = useCallback(
    (menu) => () => {
      if (menu === activeMenu) {
        setActiveMenu(null);
      } else {
        setActiveMenu(menu);
      }
    },
    [activeMenu],
  );

  return (
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
            <IconButton onClick={handleSidebarToggle} active={sidebarOpen}>
              <BoardIcon />
              <label>Board</label>
            </IconButton>
            <IconButton onClick={handleSidebarToggle} active={sidebarOpen}>
              <ChatIcon />
              <label>Chat</label>
            </IconButton>
            <IconButton onClick={handleSidebarToggle} active={sidebarOpen}>
              <MemberIcon />
              <label>Team</label>
            </IconButton>
            <IconButton onClick={handleSidebarToggle} active={sidebarOpen}>
              <ActivityIcon />
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
        <Box
          width={248}
          sx={{
            borderRight: '1px solid #E4E6EB',
            backgroundColor: '#ffffff',
          }}
        >
          <ActiveComponent />
        </Box>
      )}
    </Stack>
  );
}

export default LeftSideBar;
