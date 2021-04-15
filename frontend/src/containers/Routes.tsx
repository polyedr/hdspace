import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PATH_NAMES from '@Constants/pathNames';
import Layout from '../components/Layout';
import { selectIsLoggedIn } from '../redux/user/selectors';

const Profile = lazy(() => import('../components//User/Profile'));
const Signin = lazy(() => import('../components//User/Signin'));
const Signup = lazy(() => import('../components//User/Signup'));
const Activation = lazy(() => import('../components/User/Activation/'));
const ResetPassword = lazy(
  () => import('../components/User/ResetPassword/ResetPassword'),
);
const Projects = lazy(() => import('../components/Projects/Projects'));
const Project = lazy(() => import('./Project'));
const SharedWithLink = lazy(() => import('@Components/User/SharedWithLink'));

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
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path={PATH_NAMES.user.signin} component={Signin} />

        <Route path={PATH_NAMES.user.signup} component={Signup} />

        <Route path={PATH_NAMES.user.activate} component={Activation} />

        <Route path={PATH_NAMES.user.password} component={ResetPassword} />

        <Route path="/share/" component={SharedWithLink} exact />

        <PrivateRoute path={PATH_NAMES.projects}>
          <Layout>
            <Projects />
          </Layout>
        </PrivateRoute>

        <PrivateRoute path="/project/:projectId/:screenId?">
          {({ match: { params } }: any) => (
            <Layout>
              <Project
                projectId={parseInt(params.projectId)}
                screenId={parseInt(params.screenId)}
              />
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
    </Suspense>
  );
};

export default Routes;
