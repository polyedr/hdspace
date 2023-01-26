import React, { useState } from 'react';
import Popover from '@mui/material/Popover';

interface Props {
  name: string;
  styles: any;
}

const ScreenLongName: React.FC<Props> = ({ name, styles }) => {
  const [isOpenPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    setOpenPopover(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setOpenPopover(null);
  };
  const open = Boolean(isOpenPopover);
  return (
    <>
      <span
        className={styles.name}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {name.substr(0, 12)}
        ...
      </span>
      <Popover
        id="mouse-over-popover"
        className={styles.popover}
        classes={{
          paper: styles.paper,
        }}
        open={open}
        anchorEl={isOpenPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {name}
      </Popover>
    </>
  );
};

export default ScreenLongName;
