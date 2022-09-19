import React, { useCallback, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Button as MuiButton,
  Popover,
  styled,
  TextField,
  Stack,
} from '@mui/material';
import { format, formatISO } from 'date-fns';
import { StaticDateTimePicker } from '@mui/x-date-pickers';
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
  const [value, setValue] = React.useState<Date | null | undefined>(
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

  const handleClear = useCallback(() => {
    setValue(new Date());
    onChange('');
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'due-date-popover' : undefined;

  return (
    <>
      <Stack alignItems="center" direction="row">
        <Button icon={!date} onClick={handleOpen}>
          {date ? format(Date.parse(date), 'dd MMM hh:mm aaa') : <AddIcon />}{' '}
        </Button>

        {date ? (
          <IconButton onClick={handleClear}>
            <CloseIcon className="CloseIcon" />
          </IconButton>
        ) : null}
      </Stack>

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
        <StaticDateTimePicker
          displayStaticWrapperAs="desktop"
          disablePast
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            if (newValue) {
              onChange(formatISO(newValue));
            } else {
              onChange(undefined);
            }
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Popover>
    </>
  );
};

export default DueDate;
