// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { ContainerRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('section');

const Container: React.FC<ContainerRendererProps> = React.forwardRef(
  (props, ref) => {
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
        <section
          ref={ref}
          id={id}
          data-ls-id={id}
          key={id}
          className={cn(className, groupClass, classes.ownStyles)}
          style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
          {...eventHandlers}
        >
          {children}
        </section>
      </>
    );
  },
);

export default Container;
