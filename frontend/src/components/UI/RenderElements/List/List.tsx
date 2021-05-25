import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('list', {
  list: ({ element }: RendererProps) => ({
    listStylePosition: 'inside',
    ...(element.parameters.isOrdered && { 'list-style-type': 'decimal' }),
  }),
});

const List = React.forwardRef<HTMLOListElement, RendererProps>((props, ref) => {
  const { element, isDisabled, children } = props;
  const [className, groupClass] = element.styles.classNames;
  const { isOrdered } = element.parameters;
  const ListTag = isOrdered ? 'ol' : 'ul';
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <ListTag
      ref={ref}
      id={element.id}
      data-ls-id={element.id}
      className={cn(
        className,
        classes.list,
        groupClass,
        classes.ownStyles,
        !isDisabled && classes.ownPseudoStyles,
      )}
      {...eventHandlers}
    >
      {children}
    </ListTag>
  );
});

export default List;
