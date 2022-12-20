import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { IconButton, TextField } from '@mui/material';
import cn from 'classnames';
import { Property } from 'csstype';
// import { FormControl } from '@material-ui/core';
import { FlexConstraints as FlexConstraintsType } from '@Src/types';
import {
  RightArrowIcon,
  DownArrowIcon,
  ColumnIcon,
  RowIcon,
  ColumnGroupIcon,
  JustifyIcon,
  RectangleIcon,
} from './icons';
import {
  FlexDirection,
  FlexSpacing,
  FlexWrap,
  MarginType,
  PaddingType,
  Props,
} from './types';

import { constraintsStyles as useStyles } from './styles';

const gridValues: Property.JustifyContent[] = [
  'flex-start',
  'center',
  'flex-end',
];

const FlexConstraints: React.FC<Props> = ({
  element,
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

  const childStyles = element.styles['& > *'];

  console.log(childStyles);

  const [activeElePos, setActiveElePos] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

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
    (flexDirection: React.CSSProperties['flexDirection']) => {
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
        if (state.flexDirection === FlexDirection.ROW) {
          updateStyles({
            alignItems: justifyContent,
            justifyContent: alignItems,
          });
        } else {
          updateStyles({ justifyContent, alignItems });
        }
        setState((state) => ({ ...state, justifyContent, alignItems }));
      };
    },
    [updateStyles, setState, state.flexDirection],
  );

  const handleUpdateSpacing = useCallback(
    (value: FlexSpacing) => {
      return () => {
        updateStyles({ justifyContent: value });
        setState((state) => ({
          ...state,
          justifyContent: value,
        }));
      };
    },
    [updateStyles, setState, state.flexDirection],
  );

  const handleUpdateFlexWrap = useCallback(
    (wrap: React.CSSProperties['flexWrap']) => {
      return () => {
        updateStyles({ flexWrap: wrap });
        setState((state) => ({ ...state, flexWrap: wrap }));
      };
    },
    [updateStyles, setState],
  );

  const handleUpdateHorizontalSpacing = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value) ?? 0;

      updateStyles({
        '& > *': {
          marginLeft: `${val}px`,
          marginRight: `${val}px`,
        },
      });
    },
    [],
  );

  const handleUpdateVerticalSpacing = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value) ?? 0;

      updateStyles({
        '& > *': {
          marginTop: `${val}px`,
          marginButtom: `${val}px`,
        },
      });
    },
    [],
  );

  const activeElementStyle = useMemo(() => {
    if (!activeElePos) {
      return {};
    }

    const defaultStyle = {
      position: 'absolute',
      backgroundColor: '#E4E6EB',
    };

    if (flexDirection === FlexDirection.COLUMN) {
      return {
        ...defaultStyle,
        width: activeElePos.width - 10,
        top: 10,
        bottom: 10,
        left: activeElePos.left + 5,
      };
    }

    return {
      ...defaultStyle,
      height: activeElePos.height,
      left: 10,
      right: 10,
      top: activeElePos.top,
    };
  }, [activeElePos, flexDirection]);

  useEffect(() => {
    const elem = document.querySelector(
      '.active-flex-grid-item',
    ) as HTMLElement;
    if (elem) {
      setActiveElePos({
        left: elem.offsetLeft,
        top: elem.offsetTop,
        width: elem.clientWidth,
        height: elem.clientHeight,
      });
    } else {
      setActiveElePos(null);
    }
  }, [state.justifyContent, state.alignItems]);

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
            <TextField onChange={handleUpdateHorizontalSpacing} />
          </div>
          <div className={classes.inputWithIcon}>
            <ColumnIcon />
            <TextField onChange={handleUpdateVerticalSpacing} />
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
                  aria-label={`flex position ${align} ${justify}`}
                  size="small"
                  className={cn({
                    [`${classes.activeGridItem} active-flex-grid-item`]:
                      state.justifyContent === justify &&
                      state.alignItems === align,
                  })}
                  style={{ position: 'relative', zIndex: 1 }}
                />
              )),
            )}
            {activeElePos && (
              <div
                className={
                  FlexDirection.ROW === state.flexDirection
                    ? classes.flexRow
                    : classes.flexColumn
                }
                style={activeElementStyle}
              >
                <span />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={classes.bottomParent}>
        <div className={classes.buttonGroup}>
          <IconButton
            onClick={handleUpdateFlexWrap(FlexWrap.WRAP)}
            title="Wrap"
            className={cn(classes.iconBox, {
              [classes.iconBoxActive]:
                (state.flexWrap as string) === FlexWrap.WRAP,
            })}
          >
            <ColumnGroupIcon />
          </IconButton>
          <IconButton
            onClick={handleUpdateFlexWrap(FlexWrap.NOWRAP)}
            title="No Wrap"
            className={cn(classes.iconBox, classes.bottomIconBox, {
              [classes.iconBoxActive]:
                (state.flexWrap as string) === FlexWrap.NOWRAP,
            })}
          >
            <RectangleIcon />
            <RectangleIcon />
            <RectangleIcon />
          </IconButton>
        </div>
        <div className={classes.inputGroup}>
          <IconButton
            title="Space Between"
            onClick={handleUpdateSpacing(FlexSpacing.BETWEEEN)}
            className={cn(classes.iconBox, classes.justifyContentIcon, {
              [classes.iconBoxActive]:
                (state.justifyContent as string) === FlexSpacing.BETWEEEN,
            })}
          >
            <RectangleIcon />
            <RectangleIcon />
          </IconButton>
          <IconButton
            onClick={handleUpdateSpacing(FlexSpacing.AROUND)}
            title="Space Around"
            className={cn(classes.iconBox, {
              [classes.iconBoxActive]:
                (state.justifyContent as string) === FlexSpacing.AROUND,
            })}
          >
            <JustifyIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default FlexConstraints;
