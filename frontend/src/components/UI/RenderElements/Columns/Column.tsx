import React from 'react';
import { RendererProps } from '@Components/UI/RenderElements/types';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';

const useStyles = makeComponentStyles('column');

const Column = React.forwardRef<HTMLDivElement, RendererProps>((props, ref) => {
  const { element, children } = props;
  const [className, groupClass] = element.styles.classNames;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <div
      ref={ref}
      id={element.id}
      data-ls-id={element.id}
      className={cn(className, groupClass, classes.ownStyles)}
      {...eventHandlers}
    >
      {children}
    </div>
  );
});

export default Column;
