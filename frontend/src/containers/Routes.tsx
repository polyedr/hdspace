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
import { SignIn } from '$components/User/SignIn/SignIn';
import { SignUp } from '$components/User/SignUp/SignUp';
import { Activation } from '$components/User/Activation/Activation';
import { ResetPassword } from '$components/User/ResetPassword/ResetPassword';

const styles = require('$styles/global.scss');

type Props = RouteComponentProps;

const Component: React.FunctionComponent<Props> = (props) => {
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
        <Route path={PATH_NAMES.user.activate} component={Activation} />
        <Route path={PATH_NAMES.user.password} component={ResetPassword} />
        <Route path={PATH_NAMES.projects} component={EditorWindow} />
        <Route path="/project/:projectID/:screenID?" component={EditorWindow} />
        <Route path={PATH_NAMES.profile} component={EditorWindow} />
        <Redirect from="/*" to={PATH_NAMES.projects} />
      </Switch>
    </div>
  );
};

export const Routes = withRouter(Component);
