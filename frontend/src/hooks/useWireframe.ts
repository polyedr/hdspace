import { useParams, useRouteMatch } from 'react-router';

export const useWireframe = () => {
  const { projectId, screenId } = useParams<{
    projectId: string;
    screenId?: string;
  }>();

  const wireframePath = `/wireframe/${projectId}${
    screenId ? `/${screenId}` : ''
  }`;

  const isWireframeMode = useRouteMatch({
    path: wireframePath,
    exact: true,
  });

  return { isWireframeMode };
};
