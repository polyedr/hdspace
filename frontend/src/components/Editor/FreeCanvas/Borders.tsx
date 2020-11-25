import React, { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { splitWords } from '../../../utils/stringHelper';
import { updateElementParameters } from '../../../redux/project/actions';
import { selectCurrentScreenId } from '../../../redux/project/selectors';
import { StateElement } from '../../../types';

const useStyles = makeStyles({
  crumb: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 0,
    left: 0,
    color: 'white',
    fontSize: '.8em',
    textTransform: 'capitalize',
  },
  general: {
    backgroundColor: (props: any) => (props.isActive ? '#5A899D' : '#7a7a7a'),
    display: 'flex',
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
  },
  divider: {
    backgroundColor: '#bbb',
  },
  border: {
    position: 'absolute',
    backgroundColor: (props: any) => (props.isActive ? '#5A899D' : '#7a7a7a'),
    zIndex: 999,
  },
  topBorder: {
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  rightBorder: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 1,
  },
  bottomBorder: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  leftBorder: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 1,
  },
});

type Props = {
  element: StateElement;
  hover: boolean;
  isActive: boolean;
};

const Borders: React.FC<Props> = ({ element, isActive, hover }) => {
  const {
    id,
    name,
    parameters: { zIndex },
  } = element;
  const dispatch = useDispatch();
  const currentScreenId = useSelector(selectCurrentScreenId);
  const classes = useStyles({ isActive });
  const [open, setOpen] = useState(false);

  const moveUp = () => {
    dispatch(
      updateElementParameters(
        id,
        { zIndex: zIndex + 1 },
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
            <SettingsIcon fontSize="inherit" />
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
              <KeyboardArrowUpIcon fontSize="inherit" />
            </IconButton>

            <IconButton
              onClick={moveDown}
              className={classes.iconButton}
              title="Move element down"
              disabled={zIndex <= 0}
            >
              <KeyboardArrowDownIcon fontSize="inherit" />
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
