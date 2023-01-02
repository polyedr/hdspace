import React, { useCallback, useEffect, useState } from 'react';
import { Theme, darken } from '@mui/material';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';

export enum BackgroundPosition {
  NONE = 'none',
  TOP_LEFT = 'top left',
  TOP_CENTER = 'top center',
  TOP_RIGHT = 'top right',
  MIDDLE_LEFT = 'center left',
  MIDDLE_CENTER = 'center center',
  MIDDLE_RIGHT = 'center right',
  BOTTOM_LEFT = 'bottom left',
  BOTTOM_CENTER = 'bottom center',
  BOTTOM_RIGHT = 'bottom right',
}

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    height: 100,
    width: 100,
    background: '#F3F4F6',
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius: 2,
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
    borderRadius: 2,
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

const PositionSelector = ({ onChange, defaultValue, disabled = false }) => {
  const classes = useStyles();

  const [activePosition, setActivePosition] = useState(defaultValue ?? '');

  useEffect(() => {
    setActivePosition(defaultValue);
  }, [defaultValue]);

  const handleChangePosition = useCallback(
    (activePosition) => {
      setActivePosition(activePosition);
      onChange(activePosition);
    },
    [onChange],
  );

  const buttons = [
    {
      key: 'top-row',
      classNames: [classes.rowWrapper],
      children: [
        {
          position: BackgroundPosition.TOP_LEFT,
          classNames: [classes.button, classes.buttonSquare],
        },
        {
          position: BackgroundPosition.TOP_CENTER,
          classNames: [classes.button, classes.fillButton],
        },
        {
          position: BackgroundPosition.TOP_RIGHT,
          classNames: [classes.button, classes.buttonSquare],
        },
      ],
    },
    {
      key: 'middle-row',
      classNames: [classes.rowWrapper, classes.middleRow],
      children: [
        {
          position: BackgroundPosition.MIDDLE_LEFT,
          classNames: [
            classes.button,
            classes.fillButton,
            classes.middleSideCol,
          ],
        },
        {
          position: BackgroundPosition.MIDDLE_CENTER,
          classNames: [classes.button, classes.fillButton],
        },
        {
          position: BackgroundPosition.MIDDLE_RIGHT,
          classNames: [
            classes.button,
            classes.fillButton,
            classes.middleSideCol,
          ],
        },
      ],
    },
    {
      key: 'bottom-row',
      classNames: [classes.rowWrapper],
      children: [
        {
          position: BackgroundPosition.BOTTOM_LEFT,
          classNames: [classes.button, classes.buttonSquare],
        },
        {
          position: BackgroundPosition.BOTTOM_CENTER,
          classNames: [classes.button, classes.fillButton],
        },
        {
          position: BackgroundPosition.BOTTOM_RIGHT,
          classNames: [classes.button, classes.buttonSquare],
        },
      ],
    },
  ];

  return (
    <div className={classes.wrapper}>
      {buttons.map((row) => (
        <div className={classNames(...row.classNames)} key={row.key}>
          {row.children.map((button) => (
            <button
              key={button.position}
              disabled={disabled}
              type="button"
              onClick={() => handleChangePosition(button.position)}
              className={classNames(...button.classNames, {
                [classes.active]: activePosition === button.position,
              })}
            >
              {button.position}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PositionSelector;
