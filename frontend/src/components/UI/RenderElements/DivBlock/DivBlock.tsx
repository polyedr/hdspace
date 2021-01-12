// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { DivBlockRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles();

const DivBlockRenderer: React.FC<DivBlockRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      isDisabled,
      children,
      className,
      isBorderVisible,
      entityClass,
      groupClass,
    } = props;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          entityClass,
          groupClass,
          classes.addedElem,
          classes.ownStyles,
        )}
        style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
        {...eventHandlers}
      >
        {children}
      </div>
    );
  },
);

export default DivBlockRenderer;
