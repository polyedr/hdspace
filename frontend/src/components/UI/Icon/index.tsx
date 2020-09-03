/* eslint-disable global-require */
import React from 'react';

interface IProps {
  icon: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IProps> = ({ icon, size = 24, color = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <use
      xlinkHref={`${require('$assets/sprites/icons.svg')}#icon-${icon}`}
      x={0}
      y={0}
    />
  </svg>
);

export default Icon;
