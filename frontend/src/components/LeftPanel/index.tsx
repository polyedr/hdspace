import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubjectIcon from '@material-ui/icons/Subject';
import WebIcon from '@material-ui/icons/Web';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles, lighten } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import { changeMinLPanel } from '@Redux/user/actions';
import { selectIsLeftPanelMinimized } from '@Redux/user/selectors';
import Navigator from './Navigator';
import Screens from './Screens';
import Scrollbar from '../UI/Scrollbar';
import { LEFT_PANEL_WIDTH, LEFT_PANEL_WIDTH_MIN } from '../../styles/Theme';

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    root: {
      maxHeight: '100%',
      width: (minimized: boolean) =>
        minimized ? LEFT_PANEL_WIDTH_MIN : LEFT_PANEL_WIDTH,
      backgroundColor: palette.panel.main,
      transition: 'width 0.25s ease',
    },
    iconContainer: {
      textAlign: 'center',
    },
    iconButton: {
      color: palette.common.white,
      '&:hover': {
        backgroundColor: lighten(palette.panel.main, 0.1),
      },
    },
    content: {
      overflowX: 'hidden', // Custom scrollbars bug
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    toggleButton: {
      alignSelf: 'flex-start',
      color: palette.common.white,
      '&:hover': {
        backgroundColor: lighten(palette.panel.main, 0.1),
      },
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

  const toggleLeftPanel = () => {
    dispatch(changeMinLPanel());
  };

  return (
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
            <div>
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
            <div>
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
  );
};

export default LeftPanel;
