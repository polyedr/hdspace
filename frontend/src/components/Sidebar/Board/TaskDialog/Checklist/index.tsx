import React from 'react';
import {
  Stack,
  TextField as MuiTextField,
  IconButton as MuiIconButton,
  styled,
  InputAdornment,
  List,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CheckItem from './CheckItem';

const TextField = styled(MuiTextField)({
  '& input': {
    padding: '6.5px 14px',
  },
});

const IconButton = styled(MuiIconButton)({
  '& svg': {
    color: '#81818E',
    fontSize: 18,
  },
});

const Checklist = () => {
  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Add Item"
          fullWidth
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  <AlternateEmailIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton>
            <CheckIcon />
          </IconButton>
          <IconButton>
            <DeleteOutlineIcon />
          </IconButton>
        </Stack>
      </Stack>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {/* {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`; */}

        <CheckItem value="" />
        {/* })} */}
      </List>
    </div>
  );
};

export default React.memo(Checklist);
