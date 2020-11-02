// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { ContainerRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles();

const Container: React.FC<ContainerRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, children, className, isBorderVisible } = props;
    const classes = useStyles(props);

    return (
      <>
        <section
          ref={ref}
          id={id}
          data-ls-id={id}
          key={id}
          className={cn(
            className,
            classes.addedElem,
            classes.entityStyles,
            classes.groupStyles,
            classes.ownStyles,
          )}
          style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
        >
          {children}
        </section>
      </>
    );
  },
);

export default Container;
