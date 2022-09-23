import React, { useCallback, useState } from 'react';
import {
  Stack,
  TextField as MuiTextField,
  IconButton as MuiIconButton,
  styled,
  InputAdornment,
  List,
  Button as MuiButton,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CheckItem from './CheckItem';
import ProgressBar from './ProgressBar';

// const TextField = styled(MuiTextField)({
//   '& .MuiOutlinedInput-root': {
//     '& input': {
//       padding: '6.5px 14px',
//     },
//     '& fieldset': {
//       borderColor: '#E4E6EB !important',
//     },
//     '&:hover fieldset': {
//       borderColor: 'var(--blue)',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#E4E6EB',
//     },
//   },
// });

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

const RemoveButton = styled(MuiButton)({
  backgroundColor: '#F3F4F6',
  boxShadow: 'none',
  fontSize: 12,
  textTransform: 'capitalize',
  color: '#81818E',

  '&:hover': {
    boxShadow: 'none',
  },
});

const InfoTitle = styled('span')({
  color: '#81818E',
  fontSize: 12,
  fontWeight: 500,
  margin: '16px 0',
});

const Checklist = () => {
  const [addingItem, setAddingItem] = useState(false);

  const handleSetAddingItem = useCallback((adding: boolean) => {
    return () => setAddingItem(adding);
  }, []);

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <InfoTitle>Checklist</InfoTitle>
          <IconButton onClick={handleSetAddingItem(true)}>
            <AddIcon />
          </IconButton>
        </Stack>
        <ProgressBar />
        <RemoveButton variant="contained" color="inherit" size="small">
          Remove
        </RemoveButton>
      </Stack>
      {!addingItem || (
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
            <IconButton onClick={handleSetAddingItem(false)}>
              <CancelIcon />
            </IconButton>
          </Stack>
        </Stack>
      )}
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <CheckItem value="" />
        <CheckItem value="" />
        <CheckItem value="" />
        <CheckItem value="" />
        <CheckItem value="" />
      </List>
    </div>
  );
};

export default React.memo(Checklist);
