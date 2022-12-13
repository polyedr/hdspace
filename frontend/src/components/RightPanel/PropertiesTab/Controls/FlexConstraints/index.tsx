import React, { useCallback, useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Property } from 'csstype';
// import { FormControl } from '@material-ui/core';
import {
  Entity,
  FlexConstraints as FlexConstraintsType,
  LibraryElement,
  PropertiesChangeProps,
} from '@Src/types';
import {
  RightArrowIcon,
  DownArrowIcon,
  ColumnIcon,
  RowIcon,
  ColumnGroupIcon,
  JustifyIcon,
  RectangleIcon,
} from './icons';

const useStyles = makeStyles(() => ({
  flexParent: {
    padding: '8px 12px',
  },
  topParent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonGroup: {
    display: 'flex',
    gap: 4,
  },
  iconBox: {
    width: 28,
    height: 28,
    padding: '0 !important',
    backgroundColor: '#E4E6EB !important',
    borderRadius: '4px !important',
    transition: 'background-color 0.2s ease-in-out',

    '&:hover': {
      backgroundColor: '#2A2A2D !important',

      '& path': {
        fill: '#E4E6EB',
      },

      '& rect': {
        fill: '#E4E6EB',
      },
    },
  },
  iconBoxActive: {
    backgroundColor: '#999 !important',
    '& path': {
      fill: '#fff',
    },
  },
  inputGroup: {
    display: 'flex',
    gap: 4,
  },
  inputWithIcon: {
    height: 28,
    backgroundColor: '#E4E6EB',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 5px 0 7px',
    width: '60px',

    '& input': {
      padding: '0 0 0 8px',
      border: 'none',
      width: 30,
      height: 28,
    },

    '& fieldset': {
      border: 'none',
    },

    '& label': {
      display: 'none',
    },
  },
  spacingBox: {
    border: '1px solid #E4E6EB',
    height: 250,
    marginTop: 4,

    '& fieldset': {
      border: 'none',
    },

    '& input': {
      border: 'none',
      width: '100%',
      height: 35,
      padding: '0 5px',
      backgroundColor: '#F3F4F6',
      textAlign: 'center',
    },

    '& label': {
      display: 'none',
    },
  },
  outerTopInput: {
    width: 'calc(100% - 70px)',
    margin: 'auto',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-35px',
      borderRight: '35px solid #F3F4F6',
      borderBottom: '35px solid transparent',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: '-35px',
      borderLeft: '35px solid #F3F4F6',
      borderBottom: '35px solid transparent',
    },

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },

  outerRightInput: {
    left: 'calc(100% - 35px)',
    width: 'fit-content',
    bottom: '0',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-35px',
      right: 0,
      borderLeft: '35px solid transparent',
      borderBottom: '35px solid #F3F4F6',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-33px',
      left: '0',
      borderRight: '35px solid #F3F4F6',
      borderBottom: '33px solid transparent',
    },

    '& input': {
      height: 'calc(250px - 70px)',
      width: '35px',
      padding: '6px',
      boxSizing: 'border-box',
    },
  },

  outerBottomInput: {
    width: 'calc(100% - 70px)',
    bottom: '2px',
    margin: 'auto',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '-35px',
      borderLeft: '35px solid transparent',
      borderBottom: '35px solid #F3F4F6',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: '-35px',
      borderLeft: '35px solid #F3F4F6',
      borderTop: '33px solid transparent',
    },

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },

  outerLeftInput: {
    width: 'fit-content',
    bottom: '215px',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-35px',
      left: 0,
      borderRight: '35px solid transparent',
      borderBottom: '35px solid #F3F4F6',
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-33px',
      left: '0',
      borderRight: '35px solid transparent',
      borderTop: '33px solid #F3F4F6',
    },

    '& input': {
      height: 'calc(250px - 70px)',
      width: '35px',
      boxSizing: 'border-box',
    },
  },
  innerSpacingBox: {
    backgroundColor: '#ffffff',
    border: '1px solid #E4E6EB',
    height: 'calc(250px - 70px)',
    width: 'calc(100% - 70px)',
    margin: 'auto',
    position: 'relative',
    bottom: '395px',

    '& input': {
      backgroundColor: 'transparent',
    },
  },
  innerTopInput: {
    width: 'calc(100% - 70px)',
    margin: 'auto',

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },
  innerRightInput: {
    left: 'calc(100% - 35px)',
    width: 'fit-content',
    bottom: '0',
    position: 'relative',

    '& input': {
      height: 'calc(250px - 140px)',
      width: '35px',
      padding: '6px',
      boxSizing: 'border-box',
    },
  },
  innerBottomInput: {
    width: 'calc(100% - 70px)',
    bottom: '2px',
    margin: 'auto',
    position: 'relative',

    '& .MuiTextField-root': {
      display: 'flex',
    },
  },
  innerLeftInput: {
    width: 'fit-content',
    bottom: '146px',
    position: 'relative',

    '& input': {
      height: 'calc(250px - 140px)',
      width: '35px',
      boxSizing: 'border-box',
    },
  },
  innerButtonBox: {
    width: 'calc(100% - 70px)',
    border: '1px solid #E4E6EB',
    bottom: '256px',
    position: 'relative',
    margin: 'auto',
    height: 'calc(250px - 140px)',
    padding: 10,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'spacep-between',
    alignItems: 'center',

    '& button': {
      height: '30px',
      width: '33%',
      textAlign: 'center',
      padding: 0,

      '& span': {
        height: 4,
        width: 4,
        borderRadius: '50%',
        backgroundColor: '#B0B0BD',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },

      '&:hover': {
        backgroundColor: 'transparent',

        '& span': {
          backgroundColor: 'black',
        },
      },
    },
  },
  bottomParent: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  bottomIconBox: {
    justifyContent: 'space-around !important',
  },
  justifyContentIcon: {
    justifyContent: 'space-between !important',
    padding: '0 2px !important',
  },
}));

enum MarginType {
  TOP = 'marginTop',
  LEFT = 'marginLeft',
  RIGHT = 'marginRight',
  BOTTOM = 'marginBottom',
}

enum PaddingType {
  TOP = 'paddingTop',
  LEFT = 'paddingLeft',
  RIGHT = 'paddingRight',
  BOTTOM = 'paddingBottom',
}

enum FlexDirection {
  COLUMN = 'flex-column',
  ROW = 'flex-row',
}

const gridValues: Property.JustifyContent[] = [
  'flex-start',
  'center',
  'flex-end',
];

type Props = PropertiesChangeProps<LibraryElement<Entity>> &
  FlexConstraintsType;

const FlexConstraints: React.FC<Props> = ({
  updateStyles,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  flexDirection,
  justifyContent,
  alignItems,
  flexWrap,
  removeStyles,
}) => {
  const [state, setState] = useState<FlexConstraintsType>({
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
  });

  const classes = useStyles();

  const handleUpdateMarginPadding = useCallback(
    (position: MarginType | PaddingType) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
          updateStyles({ [position]: `${e.target.value}px` });
          setState((state) => ({ ...state, [position]: e.target.value ?? 0 }));
        } else {
          setState((state) => ({ ...state, [position]: 0 }));
          removeStyles([position]);
        }
      };
    },
    [updateStyles, setState],
  );

  const handleUpdateFlexDirection = useCallback(
    (flexDirection) => {
      return () => {
        updateStyles({ flexDirection });
        setState((state) => ({ ...state, flexDirection }));
      };
    },
    [updateStyles],
  );

  const handleChangeFlexPosition = useCallback(
    (justifyContent, alignItems) => {
      return () => {
        updateStyles({ justifyContent, alignItems });
        setState((state) => ({ ...state, justifyContent, alignItems }));
      };
    },
    [updateStyles, setState],
  );

  return (
    <div className={classes.flexParent}>
      <div className={classes.topParent}>
        <div className={classes.buttonGroup}>
          <IconButton
            className={cn(classes.iconBox, {
              [classes.iconBoxActive]:
                (state.flexDirection as string) === FlexDirection.ROW,
            })}
            onClick={handleUpdateFlexDirection(FlexDirection.ROW)}
          >
            <RightArrowIcon />
          </IconButton>
          <IconButton
            className={cn(classes.iconBox, {
              [classes.iconBoxActive]:
                (state.flexDirection as string) === FlexDirection.COLUMN,
            })}
            onClick={handleUpdateFlexDirection(FlexDirection.COLUMN)}
          >
            <DownArrowIcon />
          </IconButton>
        </div>
        <div className={classes.inputGroup}>
          <div className={classes.inputWithIcon}>
            <RowIcon />
            <TextField label="" />
          </div>
          <div className={classes.inputWithIcon}>
            <ColumnIcon />
            <TextField label="" />
          </div>
        </div>
      </div>
      <div className={classes.spacingBox}>
        <div className={classes.outerTopInput}>
          <TextField
            onChange={handleUpdateMarginPadding(MarginType.TOP)}
            value={parseInt(state.marginTop as string)}
          />
        </div>
        <div className={classes.outerRightInput}>
          <TextField
            onChange={handleUpdateMarginPadding(MarginType.RIGHT)}
            value={parseInt(state.marginRight as string)}
          />
        </div>
        <div className={classes.outerBottomInput}>
          <TextField
            onChange={handleUpdateMarginPadding(MarginType.BOTTOM)}
            value={parseInt(state.marginBottom as string)}
          />
        </div>
        <div className={classes.outerLeftInput}>
          <TextField
            onChange={handleUpdateMarginPadding(MarginType.LEFT)}
            value={parseInt(state.marginLeft as string)}
          />
        </div>
        <div className={classes.innerSpacingBox}>
          <div className={classes.innerTopInput}>
            <TextField
              onChange={handleUpdateMarginPadding(PaddingType.TOP)}
              value={parseInt(state.paddingTop as string)}
            />
          </div>
          <div className={classes.innerRightInput}>
            <TextField
              onChange={handleUpdateMarginPadding(PaddingType.RIGHT)}
              value={parseInt(state.paddingRight as string)}
            />
          </div>
          <div className={classes.innerBottomInput}>
            <TextField
              onChange={handleUpdateMarginPadding(PaddingType.BOTTOM)}
              value={parseInt(state.paddingBottom as string)}
            />
          </div>
          <div className={classes.innerLeftInput}>
            <TextField
              onChange={handleUpdateMarginPadding(PaddingType.LEFT)}
              value={parseInt(state.paddingLeft as string)}
            />
          </div>
          <div className={classes.innerButtonBox}>
            {gridValues.map((justify) =>
              gridValues.map((align) => (
                <IconButton
                  title={`${justify} ${align}`}
                  onClick={handleChangeFlexPosition(justify, align)}
                  key={`${align}-${justify}`}
                  aria-label="delete"
                  size="small"
                  style={{
                    backgroundColor:
                      state.justifyContent === justify &&
                      state.alignItems === align
                        ? 'red'
                        : 'transparent',
                  }}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <div className={classes.bottomParent}>
        <div className={classes.buttonGroup}>
          <IconButton className={classes.iconBox}>
            <ColumnGroupIcon />
          </IconButton>
          <IconButton className={cn(classes.iconBox, classes.bottomIconBox)}>
            <RectangleIcon />
            <RectangleIcon />
            <RectangleIcon />
          </IconButton>
        </div>
        <div className={classes.inputGroup}>
          <IconButton
            className={cn(classes.iconBox, classes.justifyContentIcon)}
          >
            <RectangleIcon />
            <RectangleIcon />
          </IconButton>
          <IconButton className={classes.iconBox}>
            <JustifyIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default FlexConstraints;
