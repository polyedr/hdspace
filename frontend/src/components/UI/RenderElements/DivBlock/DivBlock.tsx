import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('div');

const DivBlockRenderer = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, children, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
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
      </div>
    );
  },
);

export default DivBlockRenderer;
