/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from 'react';
import { Scrollbars, ScrollbarProps } from 'react-custom-scrollbars';
import { useDebouncedCallback } from 'use-debounce';
import cn from 'classnames';
import './styles.css';

interface IStyle {
  [x: string]: string | number;
}

const renderTrack = ({ style, trackStylesBg, scroll, show, ...props }: any) => {
  const trackStyle = {
    zIndex: 10,
    backgroundColor: trackStylesBg || 'rgba(0, 0, 0, .01)',
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
    backgroundColor: trackStylesBg || 'rgba(0, 0, 0, .01)',
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
    maxHeight: 'calc(100vh - 56px)',
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

const Scrollbar = React.forwardRef<any, ScrollbarProps>(
  ({ children, ...props }, forwardRef) => {
    return (
      <Scrollbars ref={forwardRef} autoHide {...props}>
        {children}
      </Scrollbars>
    );
  },
);

export default Scrollbar;
