import React from 'react';
import { ElementsGroupRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const ElementsGroup = React.forwardRef<
  HTMLDivElement,
  ElementsGroupRendererProps
>((props, ref) => {
  const { id, children } = props;
  const eventHandlers = useEventHandlers(props);

  return (
    <div
      id={id}
      data-ls-id={id}
      key={id}
      ref={ref as React.RefObject<HTMLDivElement>}
      {...eventHandlers}
    >
      {children}
    </div>
  );
});

export default ElementsGroup;
