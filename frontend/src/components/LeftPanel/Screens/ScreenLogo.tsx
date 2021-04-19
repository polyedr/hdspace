import React from 'react';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  image: {
    width: 24,
    height: 24,
    objectFit: 'contain',
  },
});

type Props = {
  image: string | null;
};

const ScreenLogo: React.FC<Props> = ({ image }) => {
  const classes = useStyles();

  return (
    <>
      {image ? (
        <img className={classes.image} src={image as string} alt="" />
      ) : (
        <InsertDriveFileIcon />
      )}
    </>
  );
};

export default ScreenLogo;
