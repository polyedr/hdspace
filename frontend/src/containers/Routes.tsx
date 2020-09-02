import React from 'react';
import cn from 'classnames';
import {
  withRouter,
  Switch,
  Route,
  Redirect,
  RouteComponentProps,
} from 'react-router-dom';

import * as PATH_NAMES from '$constants/pathNames';
import EditorWindow from '$containers/EditorWindow';
import { SignIn } from '../components/User/SignIn';
import SignUp from '../components/User/SignUp';
import PasswordRestore from '../components/User/PasswordRestore';

const styles = require('$styles/global.scss');

type Props = RouteComponentProps;

const Routes: React.FC<Props> = (props) => {
  const {
    location: { pathname },
  } = props;
  return (
    <div
      className={cn(
        styles.app,
        pathname === PATH_NAMES.projects
          ? styles.app_overflowY_auto
          : undefined,
      )}
    >
      <Switch>
        <Route path={PATH_NAMES.user.signin} component={SignIn} />
        <Route path={PATH_NAMES.user.signup} component={SignUp} />
        <Route path={PATH_NAMES.projects} component={EditorWindow} />
        <Route path={PATH_NAMES.passwordRestore} component={PasswordRestore} />
        <Route path="/project/:projectID/:screenID?" component={EditorWindow} />
        <Route path={PATH_NAMES.profile} component={EditorWindow} />
        <Redirect from="/*" to={PATH_NAMES.projects} />
      </Switch>
    </div>
  );
};

export default withRouter(Routes);
