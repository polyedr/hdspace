/* eslint-disable no-undef */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import SubjectIcon from '@material-ui/icons/Subject';
import WebIcon from '@material-ui/icons/Web';

import {
  lighten,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import { changeMinLPanel } from '@Redux/user/actions';
import { selectIsLeftPanelMinimized } from '@Redux/user/selectors';
import { setBordersEnabled } from '@Redux/project/actions';
import { selectVIAModeEnabled } from '@Redux/project/selectors/via';
import { IconButton } from '@material-ui/core';
import FrameworkSection from '@Components/RightPanel/FrameworkSection';
import {
  selectCurrentScreen,
  selectInfoUser,
} from '@Redux/project/selectors/screen';
import {
  LEFT_PANEL_WIDTH,
  LEFT_PANEL_WIDTH_MIN,
  PANEL_TRANSITION_DURATION,
} from '@Src/styles/Theme';
import Styles from '@Components/LeftPanel/Styles';
import Screens from './Screens';
import Scrollbar from '../UI/Scrollbar';
import ScreenEdits from './Screens/ScreenEdits';
import LeftTabPanel from './LeftTabPanel';

const useStyles = makeStyles<Theme, { minimized: boolean }>(({ palette }) =>
  createStyles({
    root: {
      maxHeight: '100%',
      width: ({ minimized }) =>
        minimized ? LEFT_PANEL_WIDTH_MIN : LEFT_PANEL_WIDTH,
      backgroundColor: palette.panel.main,
      transition: `width ${PANEL_TRANSITION_DURATION}ms ease`,
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
        transform: ({ minimized }) => `rotate(${minimized ? 90 : -90}deg)`,
        transition: 'transform 0.25s ease',
      },
    },
    iconCircleContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '10px',
    },
    editingUsers: {
      fontSize: '14px',
      color: 'white',
      marginLeft: '10px',
    },
  }),
);

const LeftPanel: React.FC = () => {
  const dispatch = useDispatch();
  const currentScreen = useSelector(selectCurrentScreen);
  const infoUser = useSelector(selectInfoUser);
  const editingUsers = currentScreen.screenData.editableScreenUser.filter(
    (item) => item.idUser !== infoUser.idUser,
  );
  const minimized = useSelector(selectIsLeftPanelMinimized);
  const viaMode = useSelector(selectVIAModeEnabled);
  const classes = useStyles({ minimized });

  const enableBordersDebounce = useDebouncedCallback(() => {
    dispatch(setBordersEnabled(true));
  }, PANEL_TRANSITION_DURATION + 120);

  const toggleLeftPanel = () => {
    dispatch(setBordersEnabled(false));
    dispatch(changeMinLPanel());
    enableBordersDebounce.callback();
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
              {editingUsers.length > 0 && (
                <div className={classes.iconCircleContainer}>
                  <ScreenEdits
                    editingUsers={editingUsers}
                    isMinimized={minimized}
                  />
                </div>
              )}
            </div>
          ) : (
            <div>
              {!viaMode && <Screens />}
              {editingUsers.length > 0 && (
                <ScreenEdits
                  editingUsers={editingUsers}
                  isMinimized={minimized}
                />
              )}
              <LeftTabPanel />
              <FrameworkSection />
              <Styles />
            </div>
          )}
        </div>
      </Scrollbar>
    </aside>
  );
};

export default LeftPanel;
