import React from 'react';
import { makeStyles } from '@mui/styles';
import { VIMEO_HEIGHT_RATIO } from '@Constants/players';
import { StateElement } from '../../../types';

export const useElementClassNames = (element: StateElement) =>
  makeStyles({
    ownStyles: { ...(element.styles.ownStyles as Object) },
  })({});

export const getWrapperStyles = (ownStyles: React.CSSProperties) =>
  makeStyles({
    ownStyles: { ...(ownStyles as Object) },
  });

export const getIframeContainerClassStyles = (style: React.CSSProperties) => ({
  height: style.height,
  ...(style.height
    ? {
        paddingTop: style.height === 'auto' ? `${VIMEO_HEIGHT_RATIO}%` : '0',
      }
    : {}),
  overflow: 'hidden',
  position: 'relative' as React.CSSProperties['position'],
});

export const getIframeContainerStyles = (ownStyles: React.CSSProperties) =>
  makeStyles({
    ownStyles: { ...getIframeContainerClassStyles(ownStyles) },
  });
