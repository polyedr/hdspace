/**
 * Thin React Router v5-compatible helpers for the RR6 cutover.
 */
import React from 'react';
import {
  useNavigate,
  useLocation,
  useParams as useParamsRR6,
  useMatch,
  Navigate,
  NavigateProps,
} from 'react-router-dom';

export function useHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  return {
    push: (to: string | number) => {
      if (typeof to === 'number') {
        navigate(to);
        return;
      }
      navigate(to);
    },
    replace: (to: string) => navigate(to, { replace: true }),
    go: (n: number) => navigate(n),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
    location,
    listen: () => () => undefined,
  };
}

type MatchArg = string | { path?: string; exact?: boolean };

export function useRouteMatch(pathOrOpts?: MatchArg) {
  const location = useLocation();
  const params = useParamsRR6();
  const path =
    typeof pathOrOpts === 'string'
      ? pathOrOpts
      : pathOrOpts?.path || undefined;
  const end =
    typeof pathOrOpts === 'object' ? Boolean(pathOrOpts?.exact) : false;

  const pattern = path ? `${path}${end ? '' : '/*'}` : '*';
  const match = useMatch({ path: pattern, end });

  if (!pathOrOpts || (typeof pathOrOpts === 'object' && !pathOrOpts.path)) {
    return { params, path: location.pathname, url: location.pathname };
  }
  if (!match) return null;
  return {
    params: match.params,
    path: match.pattern.path,
    url: match.pathname,
  };
}

export { useParamsRR6 as useParams };

/** v5 Redirect stand-in */
export function Redirect({ to }: { to: NavigateProps['to']; from?: string }) {
  return <Navigate to={to} replace />;
}
