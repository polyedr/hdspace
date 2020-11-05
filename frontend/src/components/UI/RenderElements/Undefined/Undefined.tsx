// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { SharedRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles();

const Undefined: React.FC<SharedRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, className, children } = props;
    const classes = useStyles();
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          classes.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        {children}
      </div>
    );
  },
);

export default Undefined;
