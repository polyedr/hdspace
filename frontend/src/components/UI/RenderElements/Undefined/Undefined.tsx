// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { SharedRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles();

const Undefined: React.FC<SharedRendererProps> = React.forwardRef(
  ({ id, className, children }, ref) => {
    const classes = useStyles();

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
      >
        {children}
      </div>
    );
  },
);

export default Undefined;
