import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router';
import TYPES from '@Redux/actionTypes';

export const useWireframe = () => {
  const { projectId, screenId } = useParams<{
    projectId: string;
    screenId?: string;
  }>();

  const dispatch = useDispatch();

  const wireframePath = `/wireframe/${projectId}${
    screenId ? `/${screenId}` : ''
  }`;

  const isWireframeMode = useRouteMatch({
    path: wireframePath,
    exact: true,
  });

  const undo = useCallback(() => {
    dispatch({ type: TYPES.WIREFRAME_UNDO });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: TYPES.WIREFRAME_REDO });
  }, []);

  return { isWireframeMode, undo, redo };
};
