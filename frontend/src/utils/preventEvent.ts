import { BaseSyntheticEvent } from 'react';

const prevent = (ev: BaseSyntheticEvent) => {
  ev.stopPropagation();
  ev.preventDefault();
};

export default prevent;
