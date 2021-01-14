// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import IMAGES from '@Constants/images';
import { getPlayerLink } from '@Utils/extractVideoLink';
import { VideoRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('video', {
  iframe: {
    overflow: 'hidden',
    position: 'relative,',
  },
  empty: {
    background: `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
  },
});

const Video: React.FC<VideoRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, isDisabled, className, groupClass } = props;
  const { videoSettings } = params;

  const playerLink = getPlayerLink(videoSettings, !isDisabled);

  const styles = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return playerLink ? (
    <div
      id={id}
      data-ls-id={id}
      key={id}
      ref={ref}
      className={cn(
        className,
        groupClass,
        isDisabled && styles.disabled,
        styles.ownStyles,
      )}
      {...eventHandlers}
    >
      <div
        className={cn(styles.iframe, className, groupClass, styles.ownStyles)}
      >
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
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
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      className={cn(className, groupClass, styles.empty, styles.ownStyles)}
    />
  );
});

export default Video;
