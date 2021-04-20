import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('checkbox', {});

const Checkbox = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { id, styles } = element;
    const [className, groupClass] = styles.classNames;
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
  },
);

export default Checkbox;
