import React from 'react';
import { SharedRendererProps } from '@Components/UI/RenderElements/types';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import useEventHandlers from '@Components/UI/RenderElements/useEventHandlers';
import cn from 'classnames';

const useStyles = makeComponentStyles('column');

const Column = React.forwardRef<HTMLDivElement, SharedRendererProps>(
  (props, ref) => {
    const {
      id,
      isDisabled,
      children,
      className,
      isBorderVisible,
      groupClass,
    } = props;

    const classes = useStyles(props);
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

export default Column;
