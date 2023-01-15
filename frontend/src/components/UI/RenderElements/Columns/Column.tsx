import React from 'react';
import { RendererProps } from '@Components/UI/RenderElements/types';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';

const useStyles = makeComponentStyles('columns', {
  columnsResizeable: {
    flexBasis: 'auto',
  },
});

const Column = React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => {
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
        classes.columnsResizeable,
        !isDisabled && classes.ownPseudoStyles,
      )}
      {...eventHandlers}
    >
      {children}
    </div>
  );
});

export default Column;
