import React, { useCallback, useState } from 'react';
import {
  MenuItem as MuiMenuItem,
  styled,
  Button,
  Menu as MuiMenu,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircleIcon from '@mui/icons-material/Circle';
import Fade from '@mui/material/Fade';
import { BoardTask, StatusOptions } from '@Redux/pmtools/types';

const colors = {
  [StatusOptions.Pending]: '#EF3052',
  [StatusOptions.Progress]: '#5064FF',
  [StatusOptions.Paused]: '#81818E',
  [StatusOptions.Accepted]: '#1CC09F',
  [StatusOptions.Review]: '#FAB200',
};

const MenuButton = styled(Button)<{
  statusType: StatusOptions;
}>(({ statusType }) => {
  const color = colors[statusType];
  return {
    fontSize: 14,
    fontWeight: 500,
    textTransform: 'capitalize',
    padding: '0 0 0 5px',
    color,

    '&:hover': {
      background: 'none',
    },

    '& .CircleIcon': {
      fontSize: '9px !important',
    },

    '& .css-9tj150-MuiButton-endIcon': {
      marginLeft: 3,
    },

    '& .ArrowIcon': {
      color: '#81818E',
      fontSize: '22px !important',
    },
  };
});

const MenuItem = styled(MuiMenuItem)<{
  statusType: StatusOptions;
}>(({ statusType }) => {
  const color = colors[statusType];

  return {
    fontSize: 14,
    fontWeight: 500,
    padding: '8px 16px',
    textTransform: 'capitalize',
    color,

    '& svg': {
      fontSize: 9,
      marginRight: 8,
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

const Status = ({
  task,
  onChange,
}: {
  task: BoardTask;
  onChange(status: StatusOptions): void;
}) => {
  const [status, setStatus] = useState<StatusOptions>(task.status);
  // const [status, setStatus] = useState(options[0]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelected = useCallback(
    (status) => {
      setStatus(status);
      handleClose();
      onChange(status);
    },
    [onChange],
  );

  return (
    <>
      <MenuButton
        id="status-menu-button"
        aria-controls={open ? 'status-menu-button' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon className="ArrowIcon" />}
        startIcon={<CircleIcon className="CircleIcon" />}
        statusType={status}
      >
        {status}
      </MenuButton>
      <Menu
        id="status-menu"
        MenuListProps={{
          'aria-labelledby': 'status-menu',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {Object.entries(StatusOptions).map(([, value]) => (
          <MenuItem
            key={value}
            onClick={() => handleSelected(value)}
            statusType={value}
          >
            <CircleIcon fontSize="small" /> {value}
          </MenuItem>
        ))}
        {/* {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleSelected(option)}
          >
            <CircleIcon fontSize="small" /> {option}
          </MenuItem>
        ))} */}
      </Menu>
    </>
  );
};

export default Status;
