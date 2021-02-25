import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';
import { GridItemRendererProps } from '../types';

const useStyles = makeComponentStyles('gridItem');

const Columns = React.forwardRef<HTMLDivElement, GridItemRendererProps>(
  (props, ref) => {
    const {
      id,
      isDisabled,
      children,
      className,
      isBorderVisible,
      groupClass,
    } = props;

    const classes: Record<string, any> = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
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
    );
  },
);

export default Columns;
