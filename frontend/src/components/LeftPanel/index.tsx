import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubjectIcon from '@material-ui/icons/Subject';
import WebIcon from '@material-ui/icons/Web';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import Navigator from './Navigator';
import { changeMinLPanel } from '../../redux/user/actions';
import { selectCurrentScreenId } from '../../redux/project/selectors';
import { selectIsLeftPanelMinimized } from '../../redux/user/selectors';
import Screens from './Screens';
import Scrollbar from '../UI/Scrollbar';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      maxHeight: '100%',
      width: (minimized: boolean) => (minimized ? 64 : 220),
      backgroundColor: theme.palette.panel.main,
      transition: `width 0.25s ease`,
    },
    iconContainer: {
      textAlign: 'center',
    },
    iconButton: {
      '&:hover': {
        color: theme.palette.panel.main,
        backgroundColor: theme.palette.primary.main,
      },
    },
    content: {
      overflowX: 'hidden', // Custom scrollbars bug
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    wrapper: {},
    toggleButton: {
      alignSelf: 'flex-start',
      color: '#fff',
      '& svg': {
        transform: (minimized: boolean) => `rotate(${minimized ? 90 : -90}deg)`,
        transition: 'transform 0.25s ease',
      },
    },
  }),
);

const LeftPanel: React.FC = () => {
  const dispatch = useDispatch();

  const minimized = useSelector(selectIsLeftPanelMinimized);
  const classes = useStyles(minimized);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const toggleLeftPanel = () => {
    dispatch(changeMinLPanel());
  };

  return currentScreenId !== -1 ? (
    <aside className={classes.root}>
      <Scrollbar
        style={{
          height: '100%',
          maxHeight: '100%',
          minHeight: '100%',
        }}
      >
        <div className={classes.content}>
          {minimized ? (
            <div className={classes.wrapper}>
              <div className={classes.iconContainer}>
                <IconButton
                  onClick={toggleLeftPanel}
                  className={classes.iconButton}
                  color="primary"
                  title="Screens"
                >
                  <WebIcon />
                </IconButton>
              </div>

              <div className={classes.iconContainer}>
                <IconButton
                  className={classes.iconButton}
                  onClick={toggleLeftPanel}
                  title="Navigator"
                  color="primary"
                >
                  <SubjectIcon />
                </IconButton>
              </div>
            </div>
          ) : (
            <div className={classes.wrapper}>
              <Screens />

              <Navigator />
            </div>
          )}

          <IconButton
            className={classes.toggleButton}
            onClick={toggleLeftPanel}
            title={`${minimized ? 'Open' : 'Hide'} panel`}
          >
            <VerticalAlignTopIcon />
          </IconButton>
        </div>
      </Scrollbar>
    </aside>
  ) : null;
};

export default LeftPanel;
