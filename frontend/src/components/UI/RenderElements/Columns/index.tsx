import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';
import { SharedRendererProps } from '../types';

const useStyles = makeComponentStyles();

const Columns = React.forwardRef<HTMLDivElement, SharedRendererProps>(
  (props, ref) => {
    const { id, isDisabled, children, className, isBorderVisible } = props;

    const classes: Record<string, any> = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
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
        {...eventHandlers}
      >
        {children}
      </div>
    );
  },
);

export default Columns;
