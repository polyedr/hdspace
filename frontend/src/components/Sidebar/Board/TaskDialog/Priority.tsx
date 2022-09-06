import { Menu as MuiMenu, Fade, Button, MenuItem } from '@mui/material';
import { styled } from '@mui/styles';
import React, { useCallback, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const PriorityMenu = styled(Button)({
  fontSize: 14,
  fontWeight: 500,
  textTransform: 'capitalize',
  padding: '0 16px',
  color: '#2A2A2D',

  '& .SignalIcon': {
    fontSize: '14px !important',
  },
});

const PriorityMenuItem = styled(MenuItem)({
  fontSize: 14,
  fontWeight: 500,
  padding: '8px 16px',
  color: '#2A2A2D',

  '& svg': {
    fontSize: 16,
    marginRight: 5,
  },

  '&:first-child': {
    '& svg': {
      color: '#EF3052',
    },
  },

  '&:nth-child(2)': {
    '& svg': {
      color: '#EF3052',
    },
  },

  '&:nth-child(3)': {
    '& svg': {
      color: '#FAB200',
    },
  },

  '&:nth-child(4)': {
    '& svg': {
      color: '#5064FF',
    },
  },

  '&:nth-child(5)': {
    '& svg': {
      color: '#5064FF',
    },
  },

  '&:hover': {
    backgroundColor: 'rgba(80, 100, 255, 0.1)',
  },
});

const Menu = styled(MuiMenu)({
  '& .MuiPaper-root': {
    boxShadow:
      '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.08) !important',
  },
});

const options = ['Hightest', 'High', 'Medium', 'Low', 'Lowest'];

const Priority = () => {
  const [priority, setPriority] = useState('Medium');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelected = useCallback((priority) => {
    setPriority(priority);
    handleClose();
  }, []);

  return (
    <>
      <PriorityMenu
        id="task-priority-menu-button"
        aria-controls={open ? 'task-priority-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<SignalCellularAltIcon className="SignalIcon" />}
      >
        {priority}
      </PriorityMenu>
      <Menu
        id="task-priority-menu"
        MenuListProps={{
          'aria-labelledby': 'task-priority-menu',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {options.map((priority) => (
          <PriorityMenuItem
            key={priority}
            onClick={() => handleSelected(priority)}
            data-value={priority}
          >
            <SignalCellularAltIcon fontSize="small" /> {priority}
          </PriorityMenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Priority;
