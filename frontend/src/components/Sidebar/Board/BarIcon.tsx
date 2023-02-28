import { styled } from '@mui/material';
import React, { useMemo } from 'react';
import { PriorityOptions } from '@Redux/pmtools/types';

const Container = styled('div')<{ size: number }>(({ size }) => ({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'flex-end',
  width: size,
  height: size,
  padding: '3px 0',
}));

const Bar = styled('div')<{ color: string; size: number }>(
  ({ color, size }) => ({
    width: '12%',
    height: `${size * 20}%`,
    backgroundColor: color,
    borderRadius: '2px',
  }),
);

export const colors = {
  [PriorityOptions.Highest]: '#EF3052',
  [PriorityOptions.High]: '#EF3052',
  [PriorityOptions.Medium]: '#FAB200',
  [PriorityOptions.Low]: '#5064FF',
  [PriorityOptions.Lowest]: '#5064FF',
};

interface Props {
  size?: number;
  priority: PriorityOptions;
}

function BarIcon({ priority, size = 20 }: Props) {
  const bars = useMemo(() => new Array(5).fill(1), []);

  const barCount = Object.values(PriorityOptions).indexOf(priority) + 1;
  const color = colors[priority];

  return (
    <Container size={size}>
      {bars.map((_, i) => (
        <Bar
          key={i}
          color={6 - barCount > i ? color : '#dfdfdf'}
          size={i + 1}
        />
      ))}
    </Container>
  );
}

export default BarIcon;
