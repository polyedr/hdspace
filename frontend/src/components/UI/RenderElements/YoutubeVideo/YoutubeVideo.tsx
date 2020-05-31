import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';
import { IMAGES } from '$constants/images';

import { YoutubeVideoRendererProps } from '../types';
const styles = require('../styles.scss');

const YoutubeVideoRenderer = (props: YoutubeVideoRendererProps) => {
  const { id, params, active, sortableId, style, isDisabled } = props;
  const { videoSettings: { link, autoplay, start, end, loop, rel } } = params;

  const videoID = link.replace('https://youtu.be/', '');

  const attributes = {
    start: {
      attribute: start,
      value: start,
    },
    end: {
      attribute: end,
      value: end,
    },
    loop: {
      attribute: 1,
      value: loop,
    },
    rel: {
      attribute: 0,
      value: rel,
    },
    autoplay: {
      attribute: 1,
      value: autoplay && !isDisabled,
    },
  };

  const linkAttributes = Object.entries(attributes)
    .filter(([key, { value }]) => !!value)
    .map(([key, { attribute }]) => `${key}=${attribute}`)
    .join("&");

  const fullLink = `https://www.youtube.com/embed/${videoID}?${linkAttributes}`;

  return link ? (
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
          allow={`accelerometer; ${autoplay && !isDisabled ? 'autoplay; ' : ''}encrypted-media; gyroscope; picture-in-picture`}
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

