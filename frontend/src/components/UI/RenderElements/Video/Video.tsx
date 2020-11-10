// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { VideoRendererProps } from '../types';
import { VIMEO_HEIGHT_RATIO } from '../../../../constants/players';
import IMAGES from '../../../../constants/images';
import { getPlayerLink } from '../../../../utils/extractVideoLink';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  vimeoPadding: ({ entityStyles, groupStyles, ownStyles }) => {
    const height =
      ownStyles.height || groupStyles.height || entityStyles.height;
    return {
      paddingTop: height === 'auto' ? `${VIMEO_HEIGHT_RATIO}%` : '0',
    };
  },
  iframe: {
    overflow: 'hidden',
    position: 'relative,',
  },
  empty: {
    background: `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
  },
});

const Video: React.FC<VideoRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, isDisabled, className } = props;
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
        styles.addedElem,
        isDisabled && styles.disabled,
        styles.entityStyles,
        styles.groupStyles,
        styles.ownStyles,
      )}
      {...eventHandlers}
    >
      <div
        className={cn(
          styles.iframe,
          styles.entityStyles,
          styles.groupStyles,
          styles.ownStyles,
        )}
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
      className={cn(
        className,
        styles.addedElem,
        styles.empty,
        styles.entityStyles,
        styles.groupStyles,
        styles.ownStyles,
      )}
    />
  );
});

export default Video;
