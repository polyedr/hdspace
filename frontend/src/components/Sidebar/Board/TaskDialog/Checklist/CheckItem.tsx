import React from 'react';
import {
  Box,
  Checkbox as MuiCheckbox,
  FormControlLabel,
  IconButton as MuiIconButton,
  InputAdornment,
  ListItem,
  ListItemButton as MuiListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText,
  Stack,
  styled,
  TextField as MuiTextField,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EditIcon from '@mui/icons-material/Edit';

const ListItemInput = styled(ListItem)({
  padding: 0,
});

const ListItemTitle = styled(ListItem)({
  padding: 0,
  '&:hover': {
    '& .MuiListItemSecondaryAction-root': {
      display: 'block',
    },
  },

  '& .MuiListItemSecondaryAction-root': {
    display: 'none',
  },
});

const ListItemButton = styled(MuiListItemButton)({
  padding: '0 4px',
  borderRadius: 4,

  '&:hover': {
    background: '#F3F4F6',
  },
});

const ListItemIcon = styled(MuiListItemIcon)({
  minWidth: 'auto',
});

const Checkbox = styled(MuiCheckbox)({
  color: '#E4E6EB',
});

const TextField = styled(MuiTextField)({
  width: '80%',
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

const CheckItem = ({ value }) => {
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const labelId = `checkbox-list-label-${value}`;

  return (
    <>
      <ListItemTitle
        key={value}
        secondaryAction={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton>
              <EditIcon />
            </IconButton>
            <IconButton>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        }
        disablePadding
      >
        <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked.indexOf(value) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText>List Item 1</ListItemText>
        </ListItemButton>
      </ListItemTitle>

      <ListItemInput
        key={value}
        secondaryAction={
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconButton>
              <CheckIcon />
            </IconButton>
            <IconButton>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        }
        disablePadding
      >
        <Box
          role={undefined}
          onClick={handleToggle(value)}
          px={0.5}
          width="100%"
          display="flex"
          alignItems="center"
        >
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked.indexOf(value) !== -1}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <TextField
            variant="outlined"
            placeholder="Add Item"
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
        </Box>
      </ListItemInput>
    </>
  );
};

export default React.memo(CheckItem);
