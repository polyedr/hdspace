import { BaseSyntheticEvent, SyntheticEvent } from 'react';

const prevent = (
  ev: BaseSyntheticEvent<HTMLElement> | SyntheticEvent<HTMLElement>,
) => {
  ev.stopPropagation();
  ev.preventDefault();
};

export default prevent;
