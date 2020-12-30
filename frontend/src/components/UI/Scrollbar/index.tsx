import React, { useState, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDebouncedCallback } from 'use-debounce';
import cn from 'classnames';

const styles = require('./styles.scss');

interface IStyle {
  [x: string]: string | number;
}

interface IScrollbarProps {
  children: any;
  style?: IStyle;
  className?: string;
  trackStylesBg?: string;
  autoHeightMax?: number | string;
  autoHeightMin?: string;
  hideTracksWhenNotNeeded?: boolean;
  onScroll?: (event: { srcElement: HTMLElement }) => void;
}

const renderTrack = ({ style, trackStylesBg, scroll, show, ...props }: any) => {
  const trackStyle = {
    zIndex: 10,
    backgroundColor: trackStylesBg || 'rgb(0, 0, 0, .01)',
    top: 0,
    right: 0,
    width: '6px',
    height: '100%',
    opacity: scroll ? 1 : 0.3,
    transition: scroll ? 'none' : 'opacity 0.5s ease',
  };
  return (
    <div
      hidden={!show}
      style={{ ...style, ...trackStyle }}
      className="track-vertical"
      {...props}
    />
  );
};

const renderTrackHorizontal = ({
  style,
  trackStylesBg,
  scroll,
  show,
  ...props
}: any) => {
  const trackStyle = {
    backgroundColor: trackStylesBg || 'rgb(0, 0, 0, .01)',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '6px',
    opacity: scroll ? 1 : 0.3,
    transition: scroll ? 'none' : 'opacity 0.5s ease',
  };
  return (
    <div
      hidden={!show}
      style={{ ...style, ...trackStyle }}
      className="track-horizontal"
      {...props}
    />
  );
};

const renderThumb = ({ style, ...props }: any) => {
  const thumbStyle = {
    backgroundColor: '#1cc09f',
    borderRadius: '4px',
    zIndex: '5',
  };
  return (
    <div
      style={{ ...style, ...thumbStyle }}
      className="thumb-vertical"
      {...props}
    />
  );
};

const renderView = ({ style, ...props }: any) => {
  const viewStyle = {
    position: 'relative',
    display: 'block',
    height: '100%',
    minHeight: '100%',
    marginRight: '0', // prevent react-custom-scrollbars to overwrite margins (we dont need it since we're not displaying native ones)
    marginBottom: '0',
  };
  return (
    <div
      className={cn('box', styles.removeNativeScrollbars)}
      style={{ ...style, ...viewStyle }}
      {...props}
    />
  );
};

const Scrollbar: React.FC<IScrollbarProps> = ({
  children,
  style,
  className,
  trackStylesBg,
  autoHeightMin,
  autoHeightMax,
  hideTracksWhenNotNeeded = true,
  onScroll,
}) => {
  const [show, setShow] = useState(false);
  const [scroll, setScroll] = useState(false);

  const unsetScroll = useDebouncedCallback(() => {
    setScroll(false);
  }, 500);

  const handleScroll = useCallback(
    (event) => {
      if (onScroll) {
        onScroll(event);
      }
      setScroll(true);
      unsetScroll.callback();
    },
    [onScroll, setScroll],
  );

  return (
    <Scrollbars
      style={style}
      className={className}
      autoHeight
      autoHeightMin={autoHeightMin}
      autoHeightMax={autoHeightMax}
      renderTrackVertical={(args) =>
        renderTrack({ ...args, trackStylesBg, scroll, show })
      } // TODO: find typings for all elements!
      renderTrackHorizontal={(args) =>
        renderTrackHorizontal({ ...args, trackStylesBg, scroll, show })
      }
      renderView={(args) => renderView({ ...args })}
      renderThumbVertical={renderThumb}
      renderThumbHorizontal={renderThumb}
      hideTracksWhenNotNeeded={hideTracksWhenNotNeeded}
      onScroll={handleScroll}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
    </Scrollbars>
  );
};

export default Scrollbar;
