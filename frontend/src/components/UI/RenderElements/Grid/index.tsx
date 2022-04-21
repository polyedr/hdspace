import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('grid');

const Grid = React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => {
  const { element, children, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;

  const classes: Record<string, any> = useStyles(props);
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
});

export default Grid;
