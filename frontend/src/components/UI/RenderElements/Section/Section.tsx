import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('section');

const Container = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <section
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          !isDisabled && classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        {children}
      </section>
    );
  },
);

export default Container;
