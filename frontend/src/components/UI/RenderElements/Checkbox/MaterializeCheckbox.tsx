import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('checkbox', {});

const MaterializeCheckbox = React.forwardRef<HTMLDivElement, RendererProps>(
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
      <label>
        <input
          type="checkbox"
          id={id}
          data-ls-id={id}
          className={cn(
            'filled-in',
            className,
            groupClass,
            classes.ownStyles,
            isDisabled && classes.disabled,
          )}
          checked={!isDisabled && isChecked}
          onChange={handleCheckboxChange}
        />
        <span ref={ref} {...eventHandlers}>
          {label || ''}
        </span>
      </label>
    );
  },
);

export default MaterializeCheckbox;
