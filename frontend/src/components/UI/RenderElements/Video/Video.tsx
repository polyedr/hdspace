import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';
import { IMAGES } from '$constants/images';
import { VIMEO_HEIGHT_RATIO } from '$constants/players';
import { getPlayerLink } from '$utils/extractVideoLink';

import { VideoRendererProps } from '../types';
const styles = require('../styles.scss');

const Video = (props: VideoRendererProps) => {
  const { id, params, active, sortableId, style, isDisabled } = props;
  const { videoSettings } = params;

  const playerLink = getPlayerLink(videoSettings, !isDisabled);

  return playerLink ? (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      style={style}
      className={cn(
        sharedClasses.lsItem,
        styles.addedElem,
        isDisabled && styles.disabled,
        active && sharedClasses.activated,
      )}
      tabIndex={isDisabled ? 0 : -1}
    >
      <div
        style={{
          overflow: 'hidden',
          position: 'relative',
          height: style.height,
          paddingTop: style.height === 'auto' ? `${VIMEO_HEIGHT_RATIO}%` : '0',
        }}
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
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        sharedClasses.lsItem,
        styles.addedElem,
        active && sharedClasses.activated
      )}
      style={{
        ...style,
        paddingTop: style.height === 'auto' ? `${VIMEO_HEIGHT_RATIO}%` : '0',
        background: `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
      }}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
}

export { Video };

