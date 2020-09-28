import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubjectIcon from '@material-ui/icons/Subject';
import WebIcon from '@material-ui/icons/Web';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
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
      width: (minimized) => (minimized ? 64 : 220),
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
  }),
);

const LeftPanel: React.FC = () => {
  const dispatch = useDispatch();
  const minimized = useSelector(selectIsLeftPanelMinimized);

  const classes = useStyles(minimized);
  const currentScreenId = useSelector(selectCurrentScreenId);

  const handleOpenLPanel = () => {
    dispatch(changeMinLPanel());
  };

  return currentScreenId !== -1 ? (
    <aside className={classes.root}>
      <Scrollbar
        autoHeightMin="100%"
        style={{
          height: '100%',
        }}
      >
        {minimized ? (
          <>
            <div className={classes.iconContainer}>
              <IconButton
                onClick={handleOpenLPanel}
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
                onClick={handleOpenLPanel}
                title="Navigator"
                color="primary"
              >
                <SubjectIcon />
              </IconButton>
            </div>
          </>
        ) : (
          <>
            <Screens />

            <Navigator />
          </>
        )}
      </Scrollbar>
    </aside>
  ) : null;
};

export default LeftPanel;
