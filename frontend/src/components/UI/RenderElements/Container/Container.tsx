// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { ContainerRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('div');

const Container: React.FC<ContainerRendererProps> = React.forwardRef(
  (props, ref: React.RefObject<HTMLElement>) => {
    const {
      id,
      isDisabled,
      children,
      className,
      isBorderVisible,
      groupClass,
    } = props;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <>
        <div
          ref={ref}
          id={id}
          data-ls-id={id}
          key={id}
          className={cn(className, groupClass, classes.ownStyles)}
          style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
          {...eventHandlers}
        >
          {children}
        </div>
      </>
    );
  },
);

export default Container;
