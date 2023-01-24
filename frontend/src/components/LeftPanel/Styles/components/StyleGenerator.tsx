import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Button, FormControl, Box, SxProps, Theme } from '@mui/material';
import { StyledTextField } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { generateImagePalette } from '@Redux/project/actions';

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

function StyleGenerator() {
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
          variant="contained"
          color="secondary"
          component="span"
          onClick={onGenerateClick}
        >
          Generate color scheme
        </Button>
      </div>
    </Box>
  );
}

export default StyleGenerator;
