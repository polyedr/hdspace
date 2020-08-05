import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';

import { IMAGES } from '$constants/images';
import { VIMEO_HEIGHT_RATIO } from '$constants/players';
import { getPlayerLink } from '$utils/extractVideoLink';

import { VideoRendererProps } from '../types';
const styles = require('../styles.scss');

const getWrapperStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  entityStyles: {
    ...entityStyles,
  },

  groupStyles: {
    ...groupStyles,
  },

  ownStyles: {
    ...ownStyles,
  },
});

const getIframeContainerClassStyles = (styles: React.CSSProperties) => ({
  height: styles.height,
  ...(styles.height && { paddingTop: styles.height === 'auto' ? `${VIMEO_HEIGHT_RATIO}%` : '0' }),
  overflow: 'hidden',
  position: 'relative' as React.CSSProperties['position'],
});

const getIframeContainerStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  entityStyles: {
    ...getIframeContainerClassStyles(entityStyles),
  },

  groupStyles: {
    ...getIframeContainerClassStyles(groupStyles),
  },

  ownStyles: {
    ...getIframeContainerClassStyles(ownStyles),
  },
});

const getEmptyWrapperClassStyles = (styles: React.CSSProperties) => ({
  ...styles,
  ...(styles.height && { paddingTop: styles.height === 'auto' ? `${VIMEO_HEIGHT_RATIO}%` : '0' }),
  background: `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
});

const getEmptyWrapperStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) => makeStyles({
  entityStyles: {
    ...getEmptyWrapperClassStyles(entityStyles),
  },

  groupStyles: {
    ...getEmptyWrapperClassStyles(groupStyles),
  },

  ownStyles: {
    ...getEmptyWrapperClassStyles(ownStyles),
  },
});

const Video = (props: VideoRendererProps) => {
  const {
    id,
    params,
    sortableId,
    entityStyles,
    groupStyles,
    ownStyles,
    isDisabled,
    className,
    elementRef,
  } = props;

  const { videoSettings } = params;

  const playerLink = getPlayerLink(videoSettings, !isDisabled);

  const wrapperStyles = getWrapperStyles(entityStyles, groupStyles, ownStyles)();
  const iframeContainerStyles = getIframeContainerStyles(entityStyles, groupStyles, ownStyles)();
  const emptyWrapperStyles = getEmptyWrapperStyles(entityStyles, groupStyles, ownStyles)();

  return playerLink ? (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      ref={elementRef}
      className={cn(
        className,
        styles.addedElem,
        isDisabled && styles.disabled,
        wrapperStyles.entityStyles,
        wrapperStyles.groupStyles,
        wrapperStyles.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
    >
      <div
        className={cn(
          iframeContainerStyles.entityStyles,
          iframeContainerStyles.groupStyles,
          iframeContainerStyles.ownStyles,
        )}
      >
        <iframe
          width="100%"
          height="100%"
          src={playerLink}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
          }}
        />
      </div>
    </div>
  ) : (
    <div
      ref={elementRef}
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        className,
        styles.addedElem,
        emptyWrapperStyles.entityStyles,
        emptyWrapperStyles.groupStyles,
        emptyWrapperStyles.ownStyles,
      )}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
}

export { Video };
