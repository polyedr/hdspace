import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PATH_NAMES from '@Constants/pathNames';
import MarketplaceLayout from '@Components/Marketplace/components/Layout/index';
import Spinner from '@Components/UI/Spinner';
import Layout from '../components/Layout';
import { selectIsLoggedIn } from '../redux/user/selectors';

const Profile = lazy(async () => await import('../components/User/Profile'));
const Signin = lazy(async () => await import('../components/User/Signin'));
const Signup = lazy(async () => await import('../components/User/Signup'));
const Activation = lazy(
  async () => await import('../components/User/Activation'),
);
const Success = lazy(async () => await import('../components/User/Success'));
const ResetPasswordEmail = lazy(
  async () =>
    await import('../components/User/ResetPassword/ResetPasswordEmail'),
);
const ResetPassword = lazy(
  async () => await import('../components/User/ResetPassword/ResetPassword'),
);
const Projects = lazy(
  async () => await import('../components/Projects/Projects'),
);
const Project = lazy(async () => await import('./Project'));
const Wireframe = lazy(async () => await import('../components/Wireframe'));

const SharedProject = lazy(async () => await import('./SharedProject'));
const SharedWithLink = lazy(
  async () => await import('@Components/User/SharedWithLink'),
);
const Marketplace = lazy(
  async () =>
    await import('@Components/Marketplace/components/MarketPlace/Marketplace'),
);
const Team = lazy(
  async () => await import('@Components/Marketplace/components/Team/Team'),
);

const PrivateRoute: React.FC<any> = ({ children, ...rest }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const url = new URL(window.location.href);
  const shortuuid_token = url?.pathname.split('/')[4];
  return (
    <Route {...rest}>
      {isLoggedIn || shortuuid_token ? (
        children
      ) : (
        <Redirect to={PATH_NAMES.user.signin} />
      )}
    </Route>
  );
};

const Routes: React.FC = () => (
  <Suspense fallback={<Spinner active />}>
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
      <PrivateRoute path="/share/:projectId/:screenId/">
        {({ match: { params } }: any) => (
          <Layout>
            <SharedProject
              projectId={parseInt(params.projectId)}
              screenId={parseInt(params.screenId)}
            />
          </Layout>
        )}
      </PrivateRoute>

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

      <PrivateRoute path="/wireframe/:projectId/:screenId?">
        {({ match: { params } }: any) => (
          <Layout>
            <Wireframe
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

export default Routes;
