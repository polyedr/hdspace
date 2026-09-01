import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import {
  Settings,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { Divider, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { splitWords } from '@Utils/stringHelper';
import { updateElementParameters } from '@Redux/project/actions';
import { selectCurrentScreenId } from '@Redux/project/selectors/screen';
import { StateElement } from '@Src/types';

const useStyles = makeStyles({
  crumb: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 999,
    color: 'white',
    fontSize: '.8em',
    textTransform: 'capitalize',
  },
  general: {
    backgroundColor: (props: any) => (props.isActive ? '#128A72' : '#1CC09F'),
    display: 'none',
    flexWrap: 'nowrap',
    height: 16,
    borderBottom: '1px solid #bbb',
  },
  name: {
    padding: '0 0.5em',
  },
  iconButton: {
    height: 16,
    width: 16,
    padding: 0,
    fontSize: 16,
    color: '#fff',
    borderRadius: 0,
    // display: 'none',
  },
  divider: {
    backgroundColor: '#bbb',
  },
  border: {
    position: 'absolute',
    backgroundColor: (props: any) => (props.isActive ? '#128A72' : '#1CC09F'),
    zIndex: 998,
  },
  topBorder: {
    top: 0,
    left: 0,
    right: 0,
    height: (props: any) => (props.isActive ? '1px' : '2px'),
  },
  rightBorder: {
    top: 0,
    right: 0,
    bottom: 0,
    width: (props: any) => (props.isActive ? '1px' : '2px'),
  },
  bottomBorder: {
    bottom: 0,
    left: 0,
    right: 0,
    height: (props: any) => (props.isActive ? '1px' : '2px'),
  },
  leftBorder: {
    top: 0,
    left: 0,
    bottom: 0,
    width: (props: any) => (props.isActive ? '1px' : '2px'),
  },
});

interface Props {
  element: StateElement;
  hover: boolean;
  isActive: boolean;
}

const Borders: React.FC<Props> = ({ element, isActive, hover }) => {
  const {
    id,
    name,
    parameters: { freeCanvas: { zIndex = 0 } = {} },
  } = element;
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const classes = useStyles({ isActive });
  const [open, setOpen] = useState(false);

  const moveUp = () => {
    dispatch(
      updateElementParameters(
        id,
        {
          freeCanvas: {
            ...element.parameters.freeCanvas,
            zIndex: (zIndex || 0) + 1,
          },
        },
        { screenId: currentScreenId },
      ),
    );
  };

  const moveDown = () => {
    const newIndex = zIndex ? zIndex - 1 : zIndex;
    dispatch(
      updateElementParameters(
        id,
        { zIndex: newIndex },
        { screenId: currentScreenId },
      ),
    );
  };

  return (
    <div hidden={!hover && !isActive} data-role="borders">
      <div className={classes.crumb}>
        <div className={classes.general}>
          <span className={classes.name}>{splitWords(name)}</span>

          <Divider orientation="vertical" className={classes.divider} />

          <IconButton
            onClick={() => setOpen((prevOpen) => !prevOpen)}
            className={classes.iconButton}
            title="Settings"
          >
            <Settings fontSize="inherit" />
          </IconButton>
        </div>

        <div hidden={!open} role="menu">
          <div className={classes.general}>
            <span className={classes.name}>
              Z-index:
              <b>{` ${zIndex}`}</b>
            </span>

            <Divider orientation="vertical" className={classes.divider} />

            <IconButton
              onClick={moveUp}
              className={classes.iconButton}
              title="Move element up"
            >
              <KeyboardArrowUp fontSize="inherit" />
            </IconButton>

            <IconButton
              onClick={moveDown}
              className={classes.iconButton}
              title="Move element down"
              disabled={(zIndex || 0) <= 0}
            >
              <KeyboardArrowDown fontSize="inherit" />
            </IconButton>
          </div>
        </div>
      </div>

      <div className={cn(classes.border, classes.topBorder)} />
      <div className={cn(classes.border, classes.rightBorder)} />
      <div className={cn(classes.border, classes.bottomBorder)} />
      <div className={cn(classes.border, classes.leftBorder)} />
    </div>
  );
};

export default Borders;
