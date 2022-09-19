import React from 'react';
import { Stack, TextField, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckItem from './CheckItem';

const Checklist = () => {
  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Add Item"
          fullWidth
          size="small"
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton>
            <CheckIcon />
          </IconButton>
          <IconButton>
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </Stack>
      <CheckItem />
    </div>
  );
};

export default React.memo(Checklist);
