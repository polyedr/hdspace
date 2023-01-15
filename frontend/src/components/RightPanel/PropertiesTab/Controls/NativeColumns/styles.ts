import { makeStyles } from '@mui/styles';

// eslint-disable-next-line import/prefer-default-export
export const useColumnControlStyles = makeStyles({
  control: {
    display: 'flex',
    '& > *:first-child': {
      width: '50px',
      '& input': {
        textAlign: 'right',
      },
    },
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  rootLabel: {
    marginLeft: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    paddingBottom: '0.5em',
    whiteSpace: 'nowrap',
  },
});
