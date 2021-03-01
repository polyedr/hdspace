import React, { useState } from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { RadioRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

type Props = RadioRendererProps;

const useStyles = makeComponentStyles('radiobutton', {});

const Radiobutton = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { id, /* name, params, */ isDisabled, className, groupClass } = props;

  const classes = useStyles(props);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const eventHandlers = useEventHandlers(props);

  return (
    <input
      type="radio"
      ref={ref}
      id={id}
      data-ls-id={id}
      className={cn(
        className,
        groupClass,
        isDisabled && classes.disabled,
        classes.ownStyles,
      )}
      {...eventHandlers}
      checked={!isDisabled && !isChecked}
      onChange={() => {
        if (!isDisabled && isChecked) {
          setIsChecked(!isChecked);
        }
      }}
    />
  );
});

export default Radiobutton;
