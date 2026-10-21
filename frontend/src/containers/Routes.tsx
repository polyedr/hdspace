import React, { lazy, Suspense } from 'react';
import { Routes as RRRoutes, Route, Navigate, useParams } from 'react-router-dom';
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

function RequireAuth({ children }: { children: React.ReactElement }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const url = new URL(window.location.href);
  const shortuuid_token = url?.pathname.split('/')[4];
  if (isLoggedIn || shortuuid_token) {
    return children;
  }
  return <Navigate to={PATH_NAMES.user.signin} replace />;
}

function SharedProjectRoute() {
  const params = useParams();
  return (
    <Layout>
      <SharedProject
        projectId={parseInt(params.projectId || '0', 10)}
        screenId={parseInt(params.screenId || '0', 10)}
      />
    </Layout>
  );
}

function ProjectRoute() {
  const params = useParams();
  return (
    <Layout>
      <Project
        projectId={parseInt(params.projectId || '0', 10)}
        screenId={parseInt(params.screenId || '0', 10)}
      />
    </Layout>
  );
}

function WireframeRoute() {
  const params = useParams();
  return (
    <Layout>
      <Wireframe
        projectId={parseInt(params.projectId || '0', 10)}
        screenId={parseInt(params.screenId || '0', 10)}
      />
    </Layout>
  );
}

const Routes: React.FC = () => (
  <Suspense fallback={<Spinner active />}>
    <RRRoutes>
      <Route path={PATH_NAMES.user.signin} element={<Signin {...({} as any)} />} />
      <Route path={PATH_NAMES.user.signup} element={<Signup {...({} as any)} />} />
      <Route
        path={PATH_NAMES.user.activate}
        element={<Activation {...({} as any)} />}
      />
      <Route
        path={PATH_NAMES.user.password}
        element={<ResetPasswordEmail />}
      />
      <Route
        path={PATH_NAMES.user.passwordRestore}
        element={<ResetPassword {...({} as any)} />}
      />
      <Route path={PATH_NAMES.user.success} element={<Success />} />
      <Route path="/share/" element={<SharedWithLink />} />
      <Route
        path="/share/:projectId/:screenId/"
        element={
          <RequireAuth>
            <SharedProjectRoute />
          </RequireAuth>
        }
      />
      <Route
        path={PATH_NAMES.projects}
        element={
          <RequireAuth>
            <Layout>
              <Projects />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/project/:projectId/:screenId?"
        element={
          <RequireAuth>
            <ProjectRoute />
          </RequireAuth>
        }
      />
      <Route
        path="/wireframe/:projectId/:screenId?"
        element={
          <RequireAuth>
            <WireframeRoute />
          </RequireAuth>
        }
      />
      <Route
        path={PATH_NAMES.profile}
        element={
          <RequireAuth>
            <Layout>
              <Profile />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path={PATH_NAMES.marketplace}
        element={
          <RequireAuth>
            <MarketplaceLayout>
              <Marketplace />
            </MarketplaceLayout>
          </RequireAuth>
        }
      />
      <Route
        path={PATH_NAMES.team}
        element={
          <RequireAuth>
            <MarketplaceLayout>
              <Team />
            </MarketplaceLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to={PATH_NAMES.projects} replace />} />
    </RRRoutes>
  </Suspense>
);

export default Routes;
