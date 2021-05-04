import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('checkbox', {});

const BootstrapCheckbox = React.forwardRef<HTMLInputElement, RendererProps>(
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
      <div
        ref={ref}
        {...eventHandlers}
        className={cn(
          'form-check',
          className,
          groupClass,
          classes.ownStyles,
          isDisabled && classes.disabled,
        )}
      >
        <input
          type="checkbox"
          id={id}
          data-ls-id={id}
          className="form-check-input"
          checked={!isDisabled && isChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={element.id}>{label || ''}</label>
      </div>
    );
  },
);

export default BootstrapCheckbox;
