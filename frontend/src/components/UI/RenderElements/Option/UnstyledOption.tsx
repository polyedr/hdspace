import React from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('option', {});

const UnstyledOption = React.forwardRef<HTMLOptionElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { name, value } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <option
        value={value}
        id={element.id}
        ref={ref}
        data-ls-id={element.id}
        className={cn(
          className,
          groupClass,
          isDisabled && classes.disabled,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        {name}
      </option>
    );
  },
);

export default UnstyledOption;
