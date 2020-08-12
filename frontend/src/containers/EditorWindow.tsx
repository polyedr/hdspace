import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import * as ActionsUser from '$redux/user/actions';
import * as ActionsProject from '$redux/project/actions';
import * as PATH_NAMES from '$constants/pathNames';
import ProjectsLogic from '$containers/ProjectsLogic';
import EditorLogic from '$containers/EditorLogic';
import { TopPanel } from '$components/TopPanel/TopPanel';
import { LeftPanel } from '$components/LeftPanel/LeftPanel';
import { selectors } from '$redux/project';
import { Project } from '$api/types';
import Profile from '$components/User/Profile';

const styles = require('$styles/global.scss');

const mapStateToProps = (state: AppReduxState) => ({
  isLPanelMinimized: state.user.isLPanelMinimized,
  username: state.user.userData.username,
  projects: selectors.selectProjects(state),
  pathname: state.router.location.pathname,
});

const mapDispatchToProps = {
  changeMinLPanel: ActionsUser.changeMinLPanel,
  getListProject: ActionsProject.getListProject,
  setListProject: ActionsProject.setListProject,
};

export type IAppProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps & {
    currentProject: Project;
  };

const EditorWindow: React.FC<IAppProps> = ({
  isLPanelMinimized,
  setListProject,
  username,
  projects,
  pathname,
  changeMinLPanel,
}) => (
  <>
    <LeftPanel
      pathname={pathname}
      projects={projects}
      username={username}
      isLPanelMinimized={isLPanelMinimized}
      setListProject={setListProject}
    />
    <div
      className={classNames(
        styles.globalContainer,
        isLPanelMinimized && styles.minimiser,
      )}
    >
      <TopPanel
        pathname={pathname}
        isLPanelMinimized={isLPanelMinimized}
        onMinimiserLPanel={changeMinLPanel}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorWindow);
