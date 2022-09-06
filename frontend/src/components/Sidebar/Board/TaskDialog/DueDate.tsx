import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Popover, TextField } from '@mui/material';
import { IconButton } from './StyledComponents';

const DueDate = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleOpen = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(e.currentTarget);
    },
    [setAnchorEl],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const open = Boolean(anchorEl);
  const id = open ? 'due-date-popover' : undefined;

  return (
    <>
      <IconButton onClick={handleOpen}>
        <AddIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          disablePast
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            handleClose();
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Popover>
    </>
  );
};

export default DueDate;
