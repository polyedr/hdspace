import React from 'react';
import cn from 'classnames';
import IMAGES from '@Constants/images';
import { getPlayerLink } from '@Utils/extractVideoLink';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('video', {
  iframe: {
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
  },
  empty: {
    background: `no-repeat center #E0E0E0 url(${IMAGES.youtubeIcon})`,
  },
});

const Video = React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => {
  const { element, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;
  const { videoSettings } = element.parameters;

  const playerLink = getPlayerLink(videoSettings, !isDisabled);

  const styles = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return playerLink ? (
    <div
      id={element.id}
      data-ls-id={element.id}
      ref={ref}
      className={cn(
        className,
        groupClass,
        isDisabled ? styles.disabled : styles.ownPseudoStyles,
        styles.ownStyles,
      )}
      {...eventHandlers}
    >
      <div className={styles.iframe}>
        <iframe
          title="Embedded video"
          width="100%"
          height="100%"
          src={playerLink}
          allow="autoplay"
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
      id={element.id}
      data-ls-id={element.id}
      className={cn(
        className,
        groupClass,
        styles.empty,
        styles.ownStyles,
        styles.ownPseudoStyles,
      )}
      {...eventHandlers}
    />
  );
});

export default Video;
