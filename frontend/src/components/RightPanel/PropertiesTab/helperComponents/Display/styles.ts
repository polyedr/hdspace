import makeStyles from '@material-ui/core/styles/makeStyles';

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
