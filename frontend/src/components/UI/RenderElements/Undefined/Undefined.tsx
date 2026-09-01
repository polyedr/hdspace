import React from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('undef');

const Undefined = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, children } = props;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        data-ls-id={element.id}
        className={cn(className, groupClass, classes.ownStyles)}
        {...eventHandlers}
      >
        {children}
      </div>
    );
  },
);

export default Undefined;
