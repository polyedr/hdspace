import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, FormControl, Box, SxProps, Theme } from '@mui/material';
import { StyledTextField } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { generateImagePalette } from '@Redux/project/actions';

const useButtonStyles = makeStyles<Theme>(({ palette, typography }) => ({
  root: {
    '&.MuiButton-root': {
      backgroundColor: palette.secondary.main,
      fontSize: typography.fontSize,
      marginBottom: 0,
      width: 'auto !important',
      minHeight: 'auto !important',
      padding: '0 !important',
      color: '#fff',
      textTransform: 'capitalize',

      '&:hover': {
        backgroundColor: 'rgba(17, 175, 142, 1) !important',
      },
    },
  },
}));
const useStyles = makeStyles<Theme>(() => ({
  title: {
    marginBottom: '10px',
    fontSize: 13,
  },
  orBlock: {
    margin: '15px 0',
  },
  chooseSection: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  chooseButtonText: {
    textDecoration: 'uppercase',
  },
  inputUrlContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  uploadContainer: {
    padding: '10px 25px',
  },
}));

const containerStyles: SxProps = {
  '& .style-title': {
    mb: 1,
  },
};

const StyleGenerator = () => {
  const classes = useStyles();
  const buttonClasses = useButtonStyles();
  const dispatch = useDispatch();

  const [url, setUrl] = useState<string>('');

  const onGenerateClick = () => dispatch(generateImagePalette(url));

  return (
    <Box sx={containerStyles}>
      <div className="style-title">Upload Styles</div>
      <div className={classes.chooseSection}>
        <div className={classes.inputUrlContainer}>
          <FormControl fullWidth>
            <StyledTextField
              placeholder="Upload image URL"
              size="medium"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </FormControl>
        </div>
        <Button size="small" classes={buttonClasses} onClick={onGenerateClick}>
          <div className={classes.chooseButtonText}>Generate color scheme</div>
        </Button>
      </div>
    </Box>
  );
};

export default StyleGenerator;
