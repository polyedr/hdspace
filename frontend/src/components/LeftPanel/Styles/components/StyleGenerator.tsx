import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { StyledTextField } from '@Components/styledComponents';
import { useDispatch } from 'react-redux';
import { generateImagePalette } from '@Redux/project/actions';

const useStyles = makeStyles(({ palette, typography }) => ({
  title: {
    marginBottom: '10px',
  },
  orBlock: {
    margin: '15px 0',
  },
  chooseButton: {
    backgroundColor: palette.secondary.main,
    fontSize: typography.fontSize,
    marginBottom: '5px',
  },
  chooseSection: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chooseButtonText: {
    textDecoration: 'uppercase',
  },
  inputUrlContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: '10px',
  },
}));

const StyleGenerator = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [url, setUrl] = useState<string>('');

  const onGenerateClick = () => dispatch(generateImagePalette(url));

  return (
    <div>
      <div className={classes.title}>Upload Styles</div>
      <div className={classes.chooseSection}>
        <div className={classes.inputUrlContainer}>
          <StyledTextField
            placeholder="Upload image URL"
            size="medium"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <Button
          size="large"
          className={classes.chooseButton}
          onClick={onGenerateClick}
        >
          <div className={classes.chooseButtonText}>Generate color scheme</div>
        </Button>
      </div>
    </div>
  );
};

export default StyleGenerator;
