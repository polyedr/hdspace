import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface IStyle {
  [x: string]: string | number,
}

interface IScrollbarProps {
  children: any,
  style: IStyle,
  trackStylesBg?: string,
  maxHeight: number | string,
  hideTracksWhenNotNeeded?: boolean,
  isFlex?: boolean,
}

const renderTrack = ({ style, trackStylesBg, ...props }: any) => { // TODO: add correct typings!
  const trackStyle = {
    backgroundColor: trackStylesBg || '#E7EAEC',
    borderRadius: '4px',
    top: 0,
    right: 0,
    width: '6px',
    height: '100%',
  };
  return (
    <div
      style={{ ...style, ...trackStyle }}
      className="track-vertical"
      {...props}
    />
  );
};

const renderTrackHorizontal = ({ style, trackStylesBg, ...props }: any) => {
  const trackStyle = {
    backgroundColor: trackStylesBg || '#E7EAEC',
    borderRadius: '4px',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '6px',
  };
  return (
    <div
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

const renderView = ({ style, isFlex, ...props }: any) => {
  const viewStyle = {
    display: isFlex ? 'flex' : 'block',
    ...(isFlex ? { alignItems: 'flex-start' } : {}),
    height: '100%',
    overflowX: 'hidden',
  };
  return (
    <div
      className="box"
      style={{ ...style, ...viewStyle }}
      {...props}
    />
  );
};

export const Scrollbar: React.FunctionComponent<IScrollbarProps> = ({
  children,
  style,
  trackStylesBg,
  maxHeight,
  hideTracksWhenNotNeeded = true,
  isFlex,
}) => (
  <Scrollbars
    style={style}
    autoHeight
    autoHeightMax={maxHeight}
    renderTrackVertical={args => renderTrack({ ...args, trackStylesBg })} // TODO: find typings for all elements!
    renderTrackHorizontal={args => renderTrackHorizontal({ ...args, trackStylesBg })}
    renderView={args => renderView({ ...args, isFlex })}
    renderThumbVertical={renderThumb}
    renderThumbHorizontal={renderThumb}
    hideTracksWhenNotNeeded={hideTracksWhenNotNeeded}
  >
    {children}
  </Scrollbars>
);
