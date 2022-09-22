import { Menu as MuiMenu, Fade, Button, MenuItem, styled } from '@mui/material';
import React, { useCallback, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { BoardTask, PriorityOptions } from '@Redux/pmtools/types';
import BarIcon, { colors } from '../BarIcon';

const PriorityMenu = styled(Button)({
  fontSize: 12,
  fontWeight: 500,
  textTransform: 'capitalize',
  padding: '0 0 0 5px',
  color: '#2A2A2D',

  // colors[priorityType]

  '&:hover': {
    background: 'none',
  },

  '& .SignalIcon': {
    fontSize: '14px !important',
  },

  '& .css-9tj150-MuiButton-endIcon': {
    marginLeft: 3,
  },

  '& .ArrowIcon': {
    color: '#81818E',
    fontSize: '20px !important',
  },
});

const PriorityMenuItem = styled(MenuItem)<{
  priorityType: PriorityOptions;
}>(({ priorityType }) => {
  const color = colors[priorityType];

  return {
    padding: '8px 16px',

    '& span': {
      marginLeft: '10px',
      color: '#2A2A2D',
      fontSize: 14,
      fontWeight: 500,
      textTransform: 'capitalize',
    },

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

const Priority = ({
  task,
  onChange,
}: {
  task: BoardTask;
  onChange(priority: PriorityOptions);
}) => {
  const [priority, setPriority] = useState<PriorityOptions>(task.priority);

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
    onChange(priority);
  }, []);

  return (
    <>
      <PriorityMenu
        id="task-priority-menu-button"
        aria-controls={open ? 'task-priority-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon className="ArrowIcon" />}
        startIcon={<BarIcon priority={priority} />}
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
        {Object.entries(PriorityOptions).map(([key, val]) => (
          <PriorityMenuItem
            key={val}
            priorityType={val}
            onClick={() => handleSelected(val)}
            data-value={val}
          >
            <BarIcon priority={val} /> <span>{key}</span>
          </PriorityMenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Priority;
