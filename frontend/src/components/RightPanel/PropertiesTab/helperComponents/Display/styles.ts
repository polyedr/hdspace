import { makeStyles } from '@mui/styles';

export const useWrapperStyles = makeStyles({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
});

export const useArrowStyles = makeStyles({
  arrowRotated: {
    transform: 'rotate(90deg)',
  },
});
