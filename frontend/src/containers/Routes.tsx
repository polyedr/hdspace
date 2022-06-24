import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PATH_NAMES from '@Constants/pathNames';
import MarketplaceLayout from '@Components/Marketplace/components/Layout/index';
import Layout from '../components/Layout';
import { selectIsLoggedIn } from '../redux/user/selectors';

const Profile = lazy(() => import('../components/User/Profile'));
const Signin = lazy(() => import('../components/User/Signin'));
const Signup = lazy(() => import('../components/User/Signup'));
const Activation = lazy(() => import('../components/User/Activation'));
const Success = lazy(() => import('../components/User/Success'));
const ResetPasswordEmail = lazy(
  () => import('../components/User/ResetPassword/ResetPasswordEmail'),
);
const ResetPassword = lazy(
  () => import('../components/User/ResetPassword/ResetPassword'),
);
const Projects = lazy(() => import('../components/Projects/Projects'));
const Project = lazy(() => import('./Project'));
const SharedWithLink = lazy(() => import('@Components/User/SharedWithLink'));
const Marketplace = lazy(
  () => import('@Components/Marketplace/components/MarketPlace/Marketplace'),
);
const Team = lazy(() => import('@Components/Marketplace/components/Team/Team'));
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

        <Route
          exact
          path={PATH_NAMES.user.password}
          component={ResetPasswordEmail}
        />

        <Route
          exact
          path={PATH_NAMES.user.passwordRestore}
          component={ResetPassword}
        />

        <Route path={PATH_NAMES.user.success} component={Success} />

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

        <PrivateRoute path={PATH_NAMES.marketplace}>
          <MarketplaceLayout>
            <Marketplace />
          </MarketplaceLayout>
        </PrivateRoute>

        <PrivateRoute path={PATH_NAMES.team}>
          <MarketplaceLayout>
            <Team />
          </MarketplaceLayout>
        </PrivateRoute>

        <Redirect from="/*" to={PATH_NAMES.projects} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
