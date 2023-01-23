import React, { memo, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import createColorElementIcon from '@Utils/createColorElementIcon';
import { ColorElementIcon } from '@Src/types';

interface Props {
  name: string;
}

const useStyles = makeStyles({
  square: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    height: '24px',
    width: '26px',
  },
  squareTopLeft: (colors: ColorElementIcon) => ({
    display: 'inline-block',
    height: '20px',
    width: '13px',
    backgroundColor: colors.squareTopLeft,
  }),
  squareTopRight: (colors: ColorElementIcon) => ({
    display: 'inline-block',
    height: '20px',
    width: '13px',
    backgroundColor: colors.squareTopRight,
  }),
});

const ElementButtonIcon: React.FC<Props> = ({ name }) => {
  const colors: ColorElementIcon = useMemo(
    () => createColorElementIcon(name),
    [name],
  );
  const classes = useStyles(colors);
  return (
    <>
      {!name.includes('emptyPageTemplate') && (
        <div className={classes.square}>
          <div className={classes.squareTopLeft} />
          <div className={classes.squareTopRight} />
        </div>
      )}
    </>
  );
};

export default memo(ElementButtonIcon);
