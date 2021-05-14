import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('checkbox', {});

const MaterialCheckbox = React.forwardRef<HTMLLabelElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { id, styles } = element;
    const [className, groupClass] = styles.classNames;
    const { label } = element.parameters;
    const eventHandlers = useEventHandlers(props);

    const [isChecked, setIsChecked] = useState<boolean>(false);

    const handleCheckboxChange = () => {
      if (!isDisabled) {
        setIsChecked(!isChecked);
      }
    };

    const classes = useStyles(props);

    return (
      <label
        htmlFor={element.id}
        ref={ref}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled && classes.disabled,
        )}
        {...eventHandlers}
      >
        <input
          type="checkbox"
          className="filled-in"
          id={id}
          data-ls-id={id}
          checked={!isDisabled && isChecked}
          onChange={handleCheckboxChange}
        />
        <span>{label || ''}</span>
      </label>
    );
  },
);

export default MaterialCheckbox;
