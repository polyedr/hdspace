import React from 'react';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  image: {
    width: '16px !important',
    objectFit: 'contain',
  },
});

interface Props {
  image: string | null;
}

const ScreenLogo: React.FC<Props> = ({ image }) => {
  const classes = useStyles();

  return (
    <>
      {image ? (
        <img className={classes.image} src={image} alt="" />
      ) : (
        <InsertDriveFileOutlinedIcon className={classes.image} />
      )}
    </>
  );
};

export default ScreenLogo;
