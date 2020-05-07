import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';
import { IMAGES } from '$constants/images';

import { YoutubeVideoRendererProps } from '../types';
const styles = require('../styles.scss');

const YoutubeVideoRenderer = (props: YoutubeVideoRendererProps) => {
  const { id, params, active, sortableId, style, isDisabled } = props;
  const { videoLink } = params;

  const videoID = videoLink.replace('https://youtu.be/', '');
  const fullLink = `https://www.youtube.com/embed/${videoID}`;

  return videoLink ? (
    <div
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        sharedClasses.lsItem,
        styles.addedElem,
        isDisabled && styles.disabled,
        active && sharedClasses.activated,
      )}
      style={{
        ...style,
        background: videoLink ? 'none' : `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
        overflow: 'hidden',
      }}
      tabIndex={isDisabled ? 0 : -1}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          paddingBottom: style.height === 'auto' ? '55%' : '0',
        }}
      >
        <iframe
          id="ytplayer"
          width="100%"
          height="100%"
          src={fullLink}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
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
        background: `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
      }}
      tabIndex={isDisabled ? 0 : -1}
    />
  );
}

export { YoutubeVideoRenderer };

