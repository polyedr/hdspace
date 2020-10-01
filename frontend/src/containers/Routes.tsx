import React from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import SignIn from '../components/User/SignIn/SignIn';
import SignUp from '../components/User/SignUp/SignUp';
import Activation from '../components/User/Activation/Activation';
import ResetPassword from '../components/User/ResetPassword/ResetPassword';
import EditorWindow from './EditorWindow';
import { PATH_NAMES } from '../constants/pathNames';

const Routes: React.FC = () => {
  return (
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
  );
};

export default withRouter(Routes);
