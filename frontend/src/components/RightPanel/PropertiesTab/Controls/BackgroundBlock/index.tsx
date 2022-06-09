import React, { memo, useCallback, useState } from 'react';
import {
  Entity,
  LibraryElement,
  PropertiesChangeProps,
  ElementTypeName,
} from '@Src/types';
import { useDebouncedValueChange } from '@Utils/debounceHooks';
import { makeStyles, Theme, darken } from '@material-ui/core/styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
} from '@material-ui/core';

import classNames from 'classnames';
import ColorSettings from '../../helperComponents/ColorSettings';

type Props = PropertiesChangeProps<LibraryElement<Entity>> & {
  backgroundColor?: React.CSSProperties['backgroundColor'];
  controlName?: string;
};

enum BackgroundType {
  NONE = 'None',
  IMAGE = 'Image',
  COLOR = 'Color',
}

enum BackgroundRepeat {
  NoRepeat = 'No Repeat',
  Repeat = 'Repeat',
  RepeatX = 'Repeat X',
  RepeatY = 'Repeat Y',
  Space = 'Space',
  Round = 'Round',
}

enum BackgroundPosition {
  TOP_LEFT = 'top left',
  TOP_CENTER = 'top center',
  TOP_RIGHT = 'top right',
  MIDDLE_LEFT = 'middle left',
  MIDDLE_CENTER = 'middle center',
  MIDDLE_RIGHT = 'middle right',
  BOTTOM_LEFT = 'bottom left',
  BOTTOM_CENTER = 'bottom center',
  BOTTOM_RIGHT = 'bottom right',
}

enum BackgroundSize {
  AUTO = 'Auto',
  COVER = 'Cover',
  CONTAIN = 'Contain',
}

enum BackgroundClip {
  NONE = 'None',
  BORDER_BOX = 'Border Box',
  PADDING_BOX = 'Padding Box',
  CONTENT_BOX = 'Content Box',
}

const usePositionSelectorStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 100,
    width: 100,
    background: '#F3F4F6',
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  button: {
    textIndent: '-1000px',
    border: 'none',
    background: '#E4E6EB',
    outline: 'none',
    margin: 2,
    '&:hover': {
      background: darken('#E4E6EB', 0.1),
    },
  },
  active: {
    background: '#5064FF',
    '&:hover': {
      background: '#5064FF',
    },
  },
  buttonSquare: {
    height: 22,
    width: 22,
  },
  fillButton: {
    flex: 1,
  },
  rowWrapper: {
    display: 'flex',
  },
  middleRow: {
    display: 'flex',
    flex: 1,
  },
  middleSideCol: {
    maxWidth: 22,
  },
}));

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: '0 16px',
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  imageWrapper: {
    height: 100,
    width: 100,
    background: '#ddd',
    borderRadius: 10,
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const PositionButton = () => {
  const classes = usePositionSelectorStyles();

  const [activePosition, setActivePosition] = useState('');

  return (
    <div className={classes.wrapper}>
      <div className={classes.rowWrapper}>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.TOP_LEFT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]: activePosition === BackgroundPosition.TOP_LEFT,
          })}
        >
          {BackgroundPosition.TOP_LEFT}
        </button>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.TOP_CENTER)}
          className={classNames(classes.button, classes.fillButton, {
            [classes.active]: activePosition === BackgroundPosition.TOP_CENTER,
          })}
        >
          {BackgroundPosition.TOP_CENTER}
        </button>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.TOP_RIGHT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]: activePosition === BackgroundPosition.TOP_RIGHT,
          })}
        >
          {BackgroundPosition.TOP_RIGHT}
        </button>
      </div>
      <div className={classNames(classes.rowWrapper, classes.middleRow)}>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.MIDDLE_LEFT)}
          className={classNames(
            classes.button,
            classes.fillButton,
            classes.middleSideCol,
            {
              [classes.active]:
                activePosition === BackgroundPosition.MIDDLE_LEFT,
            },
          )}
        >
          {BackgroundPosition.MIDDLE_LEFT}
        </button>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.MIDDLE_CENTER)}
          className={classNames(classes.button, classes.fillButton, {
            [classes.active]:
              activePosition === BackgroundPosition.MIDDLE_CENTER,
          })}
        >
          {BackgroundPosition.MIDDLE_CENTER}
        </button>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.MIDDLE_RIGHT)}
          className={classNames(
            classes.button,
            classes.fillButton,
            classes.middleSideCol,
            {
              [classes.active]:
                activePosition === BackgroundPosition.MIDDLE_RIGHT,
            },
          )}
        >
          {BackgroundPosition.MIDDLE_RIGHT}
        </button>
      </div>
      <div className={classes.rowWrapper}>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.BOTTOM_LEFT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]: activePosition === BackgroundPosition.BOTTOM_LEFT,
          })}
        >
          {BackgroundPosition.BOTTOM_LEFT}
        </button>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.BOTTOM_CENTER)}
          className={classNames(classes.button, classes.fillButton, {
            [classes.active]:
              activePosition === BackgroundPosition.BOTTOM_CENTER,
          })}
        >
          {BackgroundPosition.BOTTOM_CENTER}
        </button>
        <button
          type="button"
          onClick={() => setActivePosition(BackgroundPosition.BOTTOM_RIGHT)}
          className={classNames(classes.button, classes.buttonSquare, {
            [classes.active]:
              activePosition === BackgroundPosition.BOTTOM_RIGHT,
          })}
        >
          {BackgroundPosition.BOTTOM_RIGHT}
        </button>
      </div>
    </div>
  );
};

const BackgroundBlock: React.FC<Props> = ({
  removeStyles,
  updateStyles,
  element,
  backgroundColor = 'transparent',
  canEdit,
}) => {
  const classes = useStyles();

  const [type, setType] = useState(BackgroundType.NONE);

  const handleChangeType = useCallback(
    (e) => {
      setType(e.target.value);
    },
    [setType],
  );

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
        <InputLabel>Background Type</InputLabel>
        <Select onChange={handleChangeType} value={type}>
          {Object.values(BackgroundType).map((type) => (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className={classes.formControl}>
        <InputLabel>Background Style</InputLabel>
        <div className={classes.imageWrapper}>
          <Icon fontSize="medium">image</Icon>
        </div>
      </div>

      <FormControl className={classes.formControl}>
        <InputLabel>Background Repeat</InputLabel>
        <Select value={BackgroundRepeat.NoRepeat}>
          {Object.values(BackgroundRepeat).map((type) => (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <InputLabel>Position</InputLabel>
      <PositionButton />

      <FormControl className={classes.formControl}>
        <InputLabel>Background Size</InputLabel>
        <Select value={BackgroundSize.AUTO}>
          {Object.values(BackgroundSize).map((type) => (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel>Background Clip</InputLabel>
        <Select value={BackgroundClip.NONE}>
          {Object.values(BackgroundClip).map((type) => (
            <MenuItem value={type} key={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* // <div className={classes.root}>
    //   <ColorSettings
    //     onClick={removeStyles}
    //     propsToRemove={['backgroundColor']}
    //     currentColor={color as string}
    //     activeElementId={element.id}
    //     onChange={handleColorChange as (color: string) => any}
    //     disabled={!canEdit}
    //   />
    // </div> */}
    </div>
  );
};

export default memo(BackgroundBlock);
