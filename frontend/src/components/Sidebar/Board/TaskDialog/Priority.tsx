import { Menu as MuiMenu, Fade, Button, MenuItem, styled } from '@mui/material';
import React, { useCallback, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import BarIcon from '../BarIcon';

enum PriorityOptions {
  Highest = 'Highest',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Lowest = 'Lowest',
}

const colors = {
  [PriorityOptions.Highest]: '#EF3052',
  [PriorityOptions.High]: '#EF3052',
  [PriorityOptions.Medium]: '#FAB200',
  [PriorityOptions.Low]: '#5064FF',
  [PriorityOptions.Lowest]: '#5064FF',
};

const PriorityMenu = styled(Button)<{
  priorityType: keyof typeof PriorityOptions;
}>(({ priorityType }) => {
  return {
    fontSize: 14,
    fontWeight: 500,
    textTransform: 'capitalize',
    padding: '0 16px',
    color: '#5064FF',

    // colors[priorityType]

    '& .SignalIcon': {
      fontSize: '14px !important',
    },
  };
});

const PriorityMenuItem = styled(MenuItem)<{
  priorityType: keyof typeof PriorityOptions;
}>(({ priorityType }) => {
  const color = colors[priorityType];

  return {
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 16px',
    color: '#2A2A2D',

    '& svg': {
      fontSize: 16,
      marginRight: 5,
      color,
    },

    '&:hover': {
      backgroundColor: 'rgba(80, 100, 255, 0.1)',
    },
  };
});

const Menu = styled(MuiMenu)({
  '& .MuiPaper-root': {
    boxShadow:
      '0px 0px 1px rgba(42, 42, 45, 0.16), 0px 2px 6px rgba(42, 42, 45, 0.08) !important',
  },
});

const Priority = () => {
  const [priority, setPriority] =
    useState<keyof typeof PriorityOptions>('Medium');

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
        priorityType={priority}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={
          <BarIcon
            color={colors[priority]}
            barCount={Object.keys(PriorityOptions).indexOf(priority) + 1}
          />
        }
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
        {Object.values(PriorityOptions).map((priority, index) => (
          <PriorityMenuItem
            key={priority}
            priorityType={priority as keyof typeof PriorityOptions}
            onClick={() => handleSelected(priority)}
            data-value={priority}
          >
            <BarIcon color={colors[priority]} barCount={index + 1} /> {priority}
          </PriorityMenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Priority;
