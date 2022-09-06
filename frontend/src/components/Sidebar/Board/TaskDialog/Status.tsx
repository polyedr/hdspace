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

const MenuButton = styled(Button)({
  fontSize: 14,
  fontWeight: 500,
  textTransform: 'capitalize',
  padding: '0 16px',

  '& .CircleIcon': {
    fontSize: '8px !important',
  },
});

const MenuItem = styled(MuiMenuItem)({
  fontSize: 14,
  fontWeight: 500,
  padding: '8px 16px',

  '& svg': {
    fontSize: 8,
    marginRight: 5,
  },

  '&:first-child': {
    color: '#5064FF',
  },

  '&:nth-child(2)': {
    color: '#81818E',
  },

  '&:nth-child(3)': {
    color: '#1CC09F',
  },

  '&:nth-child(4)': {
    color: '#FAB200',
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

const options = [
  'Pending',
  'In Progress',
  'Paused',
  'Accepted',
  'Waiting for Review',
];

const Status = () => {
  const [status, setStatus] = useState(options[0]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSelected = useCallback((status) => {
    setStatus(status);
    handleClose();
  }, []);

  return (
    <>
      <MenuButton
        id="status-menu-button"
        aria-controls={open ? 'status-menu-button' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<CircleIcon className="CircleIcon" />}
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
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleSelected(option)}>
            <CircleIcon fontSize="small" /> {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Status;
