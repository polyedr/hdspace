import React, { memo, useRef, useMemo } from 'react';
import cn from 'classnames';
import useInterval from '@use-it/interval/dist/index';

import '../../../../styles/export/clock.css';

interface Props {
  id: string;
}

interface Dialline {
  transform?: React.CSSProperties['transform'];
}

const ClockWidget: React.FC<Props> = ({ id }) => {
  const hHand = useRef<HTMLDivElement | null>(null);
  const mHand = useRef<HTMLDivElement | null>(null);
  const sHand = useRef<HTMLDivElement | null>(null);

  const diallines = useMemo(() => {
    const dials: Dialline[] = [];
    for (let i = 0; i < 60; i++) {
      dials.push({ transform: `rotate(${6 * i}deg)` });
    }
    return dials;
  }, []);

  useInterval(() => {
    if (!hHand.current || !mHand.current || !sHand.current) {
      return;
    }
    const date = new Date();
    const hDeg = date.getHours() * 30 + date.getMinutes() * (360 / 720);
    const mDeg = date.getMinutes() * 6 + date.getSeconds() * (360 / 3600);
    const sDeg = date.getSeconds() * 6;

    hHand.current.style.transform = `rotate(${hDeg}deg)`;
    mHand.current.style.transform = `rotate(${mDeg}deg)`;
    sHand.current.style.transform = `rotate(${sDeg}deg)`;
  }, 100);

  return (
    <div className={cn('clock-widget', `widget-${id}`)}>
      <div className="dot" />
      <div>
        <div className="hour-hand" ref={hHand} />
        <div className="minute-hand" ref={mHand} />
        <div className="second-hand" ref={sHand} />
      </div>
      <div>
        <span className={cn('mark', 'h3')}>3</span>
        <span className={cn('mark', 'h6')}>6</span>
        <span className={cn('mark', 'h9')}>9</span>
        <span className={cn('mark', 'h12')}>12</span>
      </div>
      <div className="diallines" />
      {diallines.map((dial) => (
        <div
          key={dial.transform}
          className="diallines"
          style={{ transform: dial.transform }}
        />
      ))}
    </div>
  );
};

export default memo(ClockWidget);
