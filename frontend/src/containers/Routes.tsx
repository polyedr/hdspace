import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Signin from '../components/User/Signin';
import Signup from '../components/User/Signup';
import Activation from '../components/User/Activation';
import ResetPassword from '../components/User/ResetPassword/ResetPassword';
import { PATH_NAMES } from '../constants/pathNames';
import Projects from '../components/Projects/Projects';
import Layout from '../components/Layout';
import Project from './Project';
import Profile from '../components/User/Profile';
import { selectIsLoggedIn } from '../redux/user/selectors';

const PrivateRoute: React.FC<any> = ({ children, ...rest }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <Route {...rest}>
      {isLoggedIn ? children : <Redirect to={PATH_NAMES.user.signin} />}
    </Route>
  );
};

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path={PATH_NAMES.user.signin} component={Signin} />

      <Route path={PATH_NAMES.user.signup} component={Signup} />

      <Route path={PATH_NAMES.user.activate} component={Activation} />

      <Route path={PATH_NAMES.user.password} component={ResetPassword} />

      <PrivateRoute path={PATH_NAMES.projects}>
        <Layout>
          <Projects />
        </Layout>
      </PrivateRoute>

      <PrivateRoute path="/project/:projectId/:screenId?/">
        {({ match: { params } }: any) => (
          <Layout>
            <Project projectId={params.projectId} screenId={params.screenId} />
          </Layout>
        )}
      </PrivateRoute>

      <PrivateRoute path={PATH_NAMES.profile}>
        <Layout>
          <Profile />
        </Layout>
      </PrivateRoute>

      <Redirect from="/*" to={PATH_NAMES.projects} />
    </Switch>
  );
};

export default Routes;
