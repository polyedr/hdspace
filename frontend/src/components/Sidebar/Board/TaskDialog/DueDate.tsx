import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Button as MuiButton, Popover, styled, TextField } from '@mui/material';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from './StyledComponents';

const Button = styled(MuiButton)<{ icon: boolean }>(({ icon }) => {
  if (icon) {
    return {
      width: 50,
      height: 50,
    };
  }

  return {
    color: '#2A2A2D',
  };
});

interface Props {
  date: string;
  onChange(date?: string): void;
}

const DueDate = ({ date, onChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
  const [value, setValue] = React.useState<Date | null>(
    date ? new Date(date) : new Date(),
  );

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
      <Button icon={!date} onClick={handleOpen}>
        {date ? format(Date.parse(date), 'dd MMM') : <AddIcon />}{' '}
        <CloseIcon className="CloseIcon" />
      </Button>

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
            if (newValue) {
              onChange(format(newValue, 'yyyy-MM-dd'));
            } else {
              onChange(undefined);
            }
            handleClose();
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Popover>
    </>
  );
};

export default DueDate;
