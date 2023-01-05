import React from 'react';
import { type Item } from './Canvas';

interface Props {
  data: Item;
}

const Screen: React.FC<Props> = ({ data }) => {
  return <h2>{data.title}</h2>;
};

export default Screen;
