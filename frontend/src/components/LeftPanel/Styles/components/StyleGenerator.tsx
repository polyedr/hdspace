import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { StyledTextField } from '@Components/styledComponents';
import ColorSettings from '@Components/RightPanel/PropertiesTab/helperComponents/ColorSettings';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import AssetLists from '@Components/RightPanel/Assets/AssetLists';
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
  },
}));

const color: string = 'transparent';

const StyleGenerator = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [firstСolorValue, setFirstColorValue] = useDebouncedValueChange(
    color,
    (newColor: string) => {
      return newColor;
    },
  );
  const [secondСolorValue, setSecondColorValue] = useDebouncedValueChange(
    color,
    (newColor: string) => {
      return newColor;
    },
  );

  const [url, setUrl] = useState<string>('');

  const onUploadClick = () => dispatch(generateImagePalette(url));

  return (
    <div>
      <div className={classes.title}>Upload Styles</div>
      <div className={classes.chooseSection}>
        <Button size="medium" className={classes.chooseButton}>
          <div className={classes.chooseButtonText}>choose image</div>
        </Button>
        <div className={classes.orBlock}>or</div>
        <div className={classes.inputUrlContainer}>
          <StyledTextField
            placeholder="Upload image URL"
            size="small"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <Button
            size="small"
            className={classes.chooseButton}
            onClick={onUploadClick}
          >
            <div className={classes.chooseButtonText}>upload</div>
          </Button>
        </div>
      </div>
      <div className={classes.title}>Upload image to asset list</div>
      <div className={classes.chooseSection}>
        <AssetLists isDefaultStyles />
        <Button size="large" className={classes.chooseButton}>
          <div className={classes.chooseButtonText}>Generate color scheme</div>
        </Button>
        <div className={classes.orBlock}>or</div>
      </div>
      <div className={classes.title}>Choose main colors</div>
      <div>
        <ColorSettings
          currentColor={(firstСolorValue as string) || 'transparent'}
          activeElementId="test"
          onChange={setFirstColorValue as (color: string) => void}
          labelTextStyle="Color 1"
        />
        <ColorSettings
          currentColor={(secondСolorValue as string) || 'transparent'}
          activeElementId="test 1"
          onChange={setSecondColorValue as (color: string) => void}
          labelTextStyle="Color 2"
        />
      </div>
    </div>
  );
};

export default StyleGenerator;
