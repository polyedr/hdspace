import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import LeftPanel from '../components/LeftPanel/LeftPanel';
import TopPanel from '../components/TopPanel/TopPanel';
import Profile from '../components/User/Profile';
import ProjectsLogic from './ProjectsLogic';
import EditorLogic from './EditorLogic';
import { PATH_NAMES } from '../constants/pathNames';
import { getProjectList } from '../redux/project/actions';
import { selectIsLeftPanelMinimized } from '../redux/user/selectors';

const styles = require('../styles/global.scss');

const EditorWindow: React.FC = () => {
  const dispatch = useDispatch();
  const isLPanelMinimized = useSelector(selectIsLeftPanelMinimized);

  useEffect(() => {
    dispatch(getProjectList());
  }, [dispatch]);

  return (
    <>
      <LeftPanel />

      <div
        className={classNames(
          styles.globalContainer,
          isLPanelMinimized && styles.minimiser,
        )}
      >
        <TopPanel />

        <div className={styles.workContainer}>
          <Switch>
            <Route path={PATH_NAMES.projects} component={ProjectsLogic} />

            <Route
              path="/project/:projectID/:screenID?"
              component={EditorLogic}
            />

            <Route path={PATH_NAMES.profile} component={Profile} />

            <Redirect from="/*" to={PATH_NAMES.projects} />
          </Switch>
        </div>
      </div>
    </>
  );
};

export default EditorWindow;
