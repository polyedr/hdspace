/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, memo } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDebouncedCallback } from 'use-debounce';
import cn from 'classnames';
import './styles.css';

interface IStyle {
  [x: string]: string | number;
}

interface IScrollbarProps {
  children: any;
  style?: IStyle;
  className?: string;
  trackStylesBg?: string;
  autoHeightMax?: number | string;
  autoHeightMin?: number | string;
  hideTracksWhenNotNeeded?: boolean;
  onScroll?: (event: { srcElement: HTMLElement }) => void;
  onScrollStart?: () => void;
  onScrollStop?: () => void;
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
    width: '100%',
    height: '100%',
    minHeight: '100%',
    maxHeight: '50vh',
    marginRight: '0', // prevent react-custom-scrollbars to overwrite margins (we dont need it since we're not displaying native ones)
    marginBottom: '0',
    overflow: 'scroll',
  };
  return (
    <div
      className={cn('box', 'removeNativeScrollbars')}
      style={{ ...style, ...viewStyle }}
      {...props}
    />
  );
};

const Scrollbar = React.forwardRef<any, IScrollbarProps>(
  (props, forwardRef) => {
    const {
      children,
      style,
      className,
      trackStylesBg,
      autoHeightMin,
      autoHeightMax,
      hideTracksWhenNotNeeded = true,
      onScroll,
      onScrollStart,
      onScrollStop,
    } = props;
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
        ref={forwardRef}
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
        onScrollStart={onScrollStart}
        onScrollStop={onScrollStop}
      >
        {children}
      </Scrollbars>
    );
  },
);

export default memo(Scrollbar);
