import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControl } from '@material-ui/core';
import { StyledTextField } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { generateImagePalette } from '@Redux/project/actions';
import { Box, SxProps } from '@mui/material';

const useStyles = makeStyles(({ palette, typography }) => ({
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
  chooseButton: {
    backgroundColor: palette.secondary.main,
    fontSize: typography.fontSize,
    marginBottom: 0,
    width: 'auto !important',
    minHeight: 'auto !important',
    padding: '0 !important',

    '&:hover': {
      backgroundColor: 'rgba(17, 175, 142, 1) !important',
    },

    '& span': {
      color: '#fff !important',
    },
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
        <Button
          size="small"
          className={classes.chooseButton}
          onClick={onGenerateClick}
        >
          <div className={classes.chooseButtonText}>Generate color scheme</div>
        </Button>
      </div>
    </Box>
  );
};

export default StyleGenerator;
