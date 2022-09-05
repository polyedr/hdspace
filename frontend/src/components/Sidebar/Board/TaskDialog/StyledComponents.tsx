import { IconButton as MuiIconButton } from '@mui/material';
import { styled } from '@mui/styles';

export const IconButton = styled(MuiIconButton)({
  backgroundColor: '#F3F4F6',
  width: 24,
  height: 24,
  borderRadius: '50%',
  marginLeft: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 'auto',

  '& svg': {
    color: '#81818E',
    fontSize: 16,
  },
});
