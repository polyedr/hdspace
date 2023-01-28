import { makeStyles } from '@mui/styles';

// eslint-disable-next-line import/prefer-default-export
export const useColumnControlStyles = makeStyles({
  control: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: 'calc(100% - 120px)',
    '& > *:first-child': {
      marginRight: 10,
      '& input': {
        textAlign: 'right',
      },
    },
  },
  rootLabel: {
    '&.MuiFormControlLabel-root': {
      marginLeft: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
  },
  label: {
    whiteSpace: 'nowrap',
  },
});
