import { useCallback } from 'react';
import { useParams, useRouteMatch } from 'react-router';
import { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

export const useWireframe = () => {
  const { projectId, screenId } = useParams<{
    projectId: string;
    screenId?: string;
  }>();

  const moveToScreen = useCallback((screenId: number) => {
    if (window.wireframeCanvas) {
      const frame = document.getElementById(
        'wireframe-frame',
      ) as HTMLIFrameElement;

      if (frame) {
        const element = frame.contentDocument.getElementById(
          `wireframe-screen-${screenId}`,
        );

        const canvas = window.wireframeCanvas as ReactZoomPanPinchRef;

        const matrix = new WebKitCSSMatrix(
          window.getComputedStyle(element).transform,
        );

        const viewport = frame.contentDocument.querySelector(
          '.react-transform-wrapper',
        );

        canvas.setTransform(
          ((matrix.m41 - viewport.clientWidth + element.clientWidth / 2) * -1) /
            2,
          ((matrix.m42 - viewport.clientHeight + element.clientHeight / 2) *
            -1) /
            2,
          0.5,
        );
      }
    }
  }, []);

  const wireframePath = `/wireframe/${projectId}${
    screenId ? `/${screenId}` : ''
  }`;

  const isWireframeMode = useRouteMatch({
    path: wireframePath,
    exact: true,
  });

  return { isWireframeMode, moveToScreen };
};
