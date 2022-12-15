import { styled, IconButton, Box } from '@mui/material';

export const InputWithIcon = styled(Box)({
  height: 28,
  backgroundColor: '#E4E6EB',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 0 0 2px',
  width: '60px',

  '& input': {
    padding: 0,
    border: 'none',
    width: '100%',
    height: 28,
    textAlign: 'center',
  },

  '& .MuiTextField-root': {
    width: 'calc(100% - 20px)',
  },

  '& fieldset': {
    border: 'none',
  },

  '& label': {
    display: 'none',
  },
});

export const IconWithButton = styled(IconButton)({
  width: 28,
  height: 28,
  padding: '0 !important',
  backgroundColor: '#E4E6EB !important',
  borderRadius: '4px !important',
  transition: 'background-color 0.2s ease-in-out',

  '&:hover': {
    backgroundColor: '#2A2A2D !important',

    '& path': {
      stroke: '#E4E6EB',
      // fill: '#E4E6EB',
    },

    '& circle': {
      // stroke: '#E4E6EB',
      fill: '#E4E6EB',
    },

    '& rect': {
      fill: '#fff',
    },
  },
});

export default IconWithButton;
