import React from 'react';
import { type WireframeScreen } from './Canvas';

interface Props {
  data: WireframeScreen;
}

const Screen: React.FC<Props> = ({ data }) => {
  return <h2>{data.name}</h2>;
};

export default Screen;
