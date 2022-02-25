import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, MenuItem } from '@material-ui/core';
import { StyledTextField } from '@Components/styledComponents';
import FONTS from '@Constants/fonts';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';

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
  },
}));

const StyleGenerator = () => {
  // TODO:: Replace this string
  const color: string = 'transparent';
  const classes = useStyles();
  const [colorValue, handleColorValueChange] = useDebouncedValueChange(
    color,
    (newColor: string) => {
      console.log({ color: newColor });
    },
  );
  return (
    <div>
      <div className={classes.title}>Upload Styles</div>
      <div className={classes.chooseSection}>
        <Button size="medium" className={classes.chooseButton}>
          <div className={classes.chooseButtonText}>choose image</div>
        </Button>
        <div className={classes.orBlock}>or</div>
        <div className={classes.inputUrlContainer}>
          <StyledTextField placeholder="Upload image URL" size="small" />
          <Button size="small" className={classes.chooseButton}>
            <div className={classes.chooseButtonText}>upload</div>
          </Button>
        </div>
      </div>
      <div className={classes.title}>Upload image to asset list</div>
      <div className={classes.chooseSection}>
        <StyledTextField
          fullWidth
          margin="dense"
          label="Project assets"
          value={FONTS[0].value}
          onChange={() => console.log('Upload from project assets')}
          select
        >
          {FONTS.map(({ label, value }) => (
            <MenuItem value={value} key={value} dense>
              {label}
            </MenuItem>
          ))}
        </StyledTextField>
        <Button size="large" className={classes.chooseButton}>
          <div className={classes.chooseButtonText}>Generate color scheme</div>
        </Button>
        <div className={classes.orBlock}>or</div>
      </div>
      <div className={classes.title}>Choose main colors</div>
      <div>
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="test"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Color 1"
        />
        <ColorSettings
          currentColor={(colorValue as string) || 'transparent'}
          activeElementId="test"
          onChange={handleColorValueChange as (color: string) => void}
          labelTextStyle="Color 2"
        />
      </div>
    </div>
  );
};

export default StyleGenerator;
