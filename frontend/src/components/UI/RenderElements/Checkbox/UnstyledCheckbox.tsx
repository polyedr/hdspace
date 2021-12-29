import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('checkbox', {});

const UnstyledCheckbox = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const { element, isDisabled } = props;
    const { id, styles } = element;
    const [className, groupClass] = styles.classNames;
    const eventHandlers = useEventHandlers(props, {
      onChange: () => {
        if (!isDisabled) {
          setIsChecked(!isChecked);
        }
      },
    });

    const classes = useStyles(props);

    return (
      <div
        ref={ref}
        id={id}
        {...eventHandlers}
        data-ls-id={id} >
        <input
          type="checkbox"
          name="Checkbox"
          className={cn(
            className,
            groupClass,
            classes.ownStyles,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
          )}
          checked={!isDisabled && isChecked}
        />
        <label>{element.parameters.value}</label>

      </div>
    );
  },
);

export default UnstyledCheckbox;
