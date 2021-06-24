import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Avatar from '@material-ui/core/Avatar';
import React, { useState } from 'react';
import { EditableScreenUser } from '@Src/types';

type Props = {
  editingUsers: Array<EditableScreenUser>;
  isMinimized: boolean;
};

const styles = makeStyles((theme) => ({
  editingUsers: {
    fontSize: '14px',
    color: 'white',
    marginLeft: '10px',
    lineHeight: '4px',
    '& span': {
      cursor: 'pointer',
      color: '#1cc09f',
    },
  },

  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: '8px',
  },
  circle: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: 'white',
    color: '#1cc09f',
  },
}));

const ScreenEdits: React.FC<Props> = ({ editingUsers, isMinimized }) => {
  const classes = styles();
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
      {isMinimized ? (
        <>
          <Avatar
            className={classes.circle}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            {editingUsers.length}
          </Avatar>
          <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
              paper: classes.paper,
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
            {editingUsers.map((item) => item.firstName)}
          </Popover>
        </>
      ) : (
        <>
          <p className={classes.editingUsers}>
            Screen edits
            <span
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              &nbsp;
              {editingUsers.length}
            </span>
          </p>
          <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
              paper: classes.paper,
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
            {editingUsers.map((item: EditableScreenUser) => item.firstName)}
          </Popover>
        </>
      )}
    </>
  );
};

export default ScreenEdits;
