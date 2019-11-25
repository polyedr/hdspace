import React, { memo, useState, useEffect } from 'react';
import Clock from 'react-clock';

type Props = {
  size?: number,
};

export const ClockWidget: React.FunctionComponent<Props> = memo(({
  size = 150,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const clock = setInterval(
      () => setCurrentDate(new Date()),
      1000,
    );

    return () => {
      clearInterval(clock);
    };
  });

  return (
    <Clock
      value={currentDate}
      size={size}
    />
  );
});
