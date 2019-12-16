import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AppReduxState } from '$shared/types/app';
import * as ActionsUser from '$redux/user/actions';
import * as ActionsProject from '$redux/project/actions';
import * as PATH_NAMES from '$constants/pathNames';
import ProjectsLogic from '$containers/ProjectsLogic';
import EditorLogic from '$containers/EditorLogic';
import { TopPanel } from '$components/TopPanel';
import { LeftPanel } from '$components/LeftPanel';
import { IProject } from '$redux/project/types';
import { selectors } from '$redux/project';

const styles = require('$styles/global.scss');

const mapStateToProps = (state: AppReduxState) => ({
  isLPanelMinimized: state.user.isLPanelMinimized,
  tokenPair: state.user.tokenPair,
  username: state.user.userData.username,
  projects: selectors.selectProjects(state),
  pathname: state.router.location.pathname,
});

const mapDispatchToProps = {
  changeMinLPanel: ActionsUser.changeMinLPanel,
  setTokenPair: ActionsUser.setTokenPair,
  getListProject: ActionsProject.getListProject,
  setListProject: ActionsProject.setListProject,
};

export type IAppProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {
  currentProject: IProject,
}

const EditorWindow: React.FunctionComponent<IAppProps> = ({
  isLPanelMinimized,
  tokenPair,
  setListProject,
  username,
  projects,
  pathname,
  getListProject,
  changeMinLPanel,
  setTokenPair,
}) => (
  <React.Fragment>
    <LeftPanel
      pathname={pathname}
      projects={projects}
      username={username}
      userType="Web Developer"
      isLPanelMinimized={isLPanelMinimized}
      tokenPair={tokenPair}
      setListProject={setListProject}
      getListProject={getListProject}
      setTokenPair={setTokenPair}
    />
    <div className={classNames(styles.globalContainer, isLPanelMinimized && styles.minimiser)}>
      <TopPanel
        pathname={pathname}
        isLPanelMinimized={isLPanelMinimized}
        onMinimiserLPanel={changeMinLPanel}
      />
      <div className={styles.workContainer}>
        <Switch>
          <Route
            path={PATH_NAMES.projects}
            component={ProjectsLogic}
          />
          <Route
            path="/project/:projectID/:screenID?"
            component={EditorLogic}
          />
          <Redirect from="/*" to={PATH_NAMES.projects} />
        </Switch>
      </div>
    </div>
  </React.Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(EditorWindow);
