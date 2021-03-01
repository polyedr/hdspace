import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderElements/useEventHandlers';
import cn from 'classnames';
import { CheckboxRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('checkbox', {});

type Props = CheckboxRendererProps;

const Checkbox = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { id, /* params, */ isDisabled, className, groupClass } = props;
  const eventHandlers = useEventHandlers(props);

  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    if (!isDisabled) {
      setIsChecked(!isChecked);
    }
  };

  const classes = useStyles(props);

  return (
    <input
      type="checkbox"
      ref={ref}
      id={id}
      data-ls-id={id}
      className={cn(
        className,
        groupClass,
        classes.ownStyles,
        isDisabled && classes.disabled,
      )}
      checked={!isDisabled && isChecked}
      onChange={handleCheckboxChange}
      {...eventHandlers}
    />
  );
});

export default Checkbox;
