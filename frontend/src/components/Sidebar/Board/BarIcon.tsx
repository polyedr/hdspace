import { styled } from '@mui/material';
import React, { useMemo } from 'react';

const Container = styled('div')<{ size: number }>(({ size }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'flex-end',
  width: size,
  height: size,
}));

const Bar = styled('div')<{ color: string; size: number }>(
  ({ color, size }) => ({
    width: '10%',
    height: `${size * 20}%`,
    backgroundColor: color,
    borderRadius: '2px',
  }),
);

interface Props {
  size?: number;
  color: string;
  barCount: number;
}

const BarIcon = ({ color, barCount, size = 15 }: Props) => {
  const bars = useMemo(() => {
    return new Array(5).fill(1);
  }, []);

  return (
    <Container size={size}>
      {bars.map((_, i) => (
        <Bar color={6 - barCount > i ? color : '#dfdfdf'} size={i + 1} />
      ))}
    </Container>
  );
};

export default BarIcon;
