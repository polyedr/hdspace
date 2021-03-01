import React from 'react';
import { SelectItemRendererProps } from '@Components/UI/RenderElements/types';
import useEventHandlers from '@Components/UI/RenderElements/useEventHandlers';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('select-item', {});

type Props = SelectItemRendererProps;

const SelectItem = React.forwardRef<HTMLOptionElement, Props>((props, ref) => {
  const {
    id,
    params: { name, value },
    isDisabled,
    className,
    groupClass,
  } = props;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <option
      value={value}
      id={id}
      ref={ref}
      data-ls-id={id}
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
});

export default SelectItem;
