import React from 'react';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const ElementsGroup = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, children } = props;
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        id={element.id}
        data-ls-id={element.id}
        ref={ref as React.RefObject<HTMLDivElement>}
        {...eventHandlers}
      >
        {children}
      </div>
    );
  },
);

export default ElementsGroup;
