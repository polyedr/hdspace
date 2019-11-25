import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route, Redirect } from 'react-router-dom';

import { AppReduxState } from '$shared/types/app';
import * as ActionsUser from '$redux/user/actions';
import * as ActionsProject from '$redux/project/actions';
import * as PATH_NAMES from '$constants/pathNames';
import { history } from '$redux/store';
import EditorWindow from '$containers/EditorWindow';
import { SignIn } from '$components/User/SignIn';
import { SignUp } from '$components/User/SignUp';
import { PasswordRestore } from '$components/User/PasswordRestore';

const styles = require('$styles/global.scss');

const mapStateToProps = ({
  user: { isLPanelMinimized },
  project: { listProject },
  router: { location: { pathname } },
}: AppReduxState) => ({
  isLPanelMinimized,
  listProject,
  pathname,
});

const mapDispatchToProps = {
  changeMinLPanel: ActionsUser.changeMinLPanel,
  getListProject: ActionsProject.getListProject,
};

export type IAppProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Component: React.FunctionComponent<IAppProps> = () => {
  return (
    <ConnectedRouter history={history}>
      <div className={styles.app}>
        <Switch>
          <Route
            path={PATH_NAMES.user.signin}
            component={SignIn}
          />
          <Route
            path={PATH_NAMES.user.signup}
            component={SignUp}
          />
          <Route
            path={PATH_NAMES.projects}
            component={EditorWindow}
          />
          <Route
            path={PATH_NAMES.passwordRestore}
            component={PasswordRestore}
          />
          <Route
            path="/project/:projectID/:screenID?"
            component={EditorWindow}
          />
          <Redirect from="/*" to={PATH_NAMES.projects} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
};

export const App = connect(mapStateToProps, mapDispatchToProps)(hot(module)(Component));
