// @ts-nocheck

import React from 'react';
import { SharedRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const ElementsGroup: React.FC<SharedRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, children } = props;
    const eventHandlers = useEventHandlers(props);
    return (
      <div id={id} data-ls-id={id} key={id} ref={ref} {...eventHandlers}>
        {children}
      </div>
    );
  },
);

export default ElementsGroup;
