import React from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import SignIn from '../components/User/Signin';
import Signup from '../components/User/Signup';
import Activation from '../components/User/Activation';
import ResetPassword from '../components/User/ResetPassword/ResetPassword';
import { PATH_NAMES } from '../constants/pathNames';
import Projects from '../components/Projects/Projects';
import Layout from '../components/Layout';
import EditorLogic from './EditorLogic';
import Profile from '../components/User/Profile';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={PATH_NAMES.user.signin} component={SignIn} />

      <Route path={PATH_NAMES.user.signup} component={Signup} />

      <Route path={PATH_NAMES.user.activate} component={Activation} />

      <Route path={PATH_NAMES.user.password} component={ResetPassword} />

      <Route path={PATH_NAMES.projects}>
        <Layout>
          <Projects />
        </Layout>
      </Route>

      <Route path="/project/:projectId/:screenId?">
        {({ match: { params } }: any) => (
          <Layout>
            <EditorLogic
              projectId={params.projectId}
              screenId={params.screenId}
            />
          </Layout>
        )}
      </Route>

      <Route path={PATH_NAMES.profile}>
        <Layout>
          <Profile />
        </Layout>
      </Route>

      <Redirect from="/*" to={PATH_NAMES.projects} />
    </Switch>
  );
};

export default withRouter(Routes);
