import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('checkbox', {});

const MaterialCheckbox = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { id, styles } = element;
    const [className, groupClass] = styles.classNames;
    const eventHandlers = useEventHandlers(props);

    const [isChecked, setIsChecked] = useState<boolean>(false);
    const classes = useStyles(props);

    return (
      <div
        ref={ref}
        data-ls-id={id}
        className={cn(
          'mdc-touch-target-wrapper',
          className,
          groupClass,
          classes.ownStyles,
          isDisabled && classes.disabled,
        )}
        {...eventHandlers}
      >
        <div className="mdc-checkbox mdc-checkbox--touch">
          <input
            type="checkbox"
            className="mdc-checkbox__native-control"
            id={id}
            onChange={() => {
              if (!isDisabled) {
                setIsChecked(!isChecked);
              }
            }}
          />
          <div className="mdc-checkbox__background">
            <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path
                className="mdc-checkbox__checkmark-path"
                fill="none"
                d="M1.73,12.91 8.1,19.28 22.79,4.59"
              />
            </svg>
            <div className="mdc-checkbox__mixedmark" />
          </div>
          <div className="mdc-checkbox__ripple" />
        </div>
      </div>
    );
  },
);

export default MaterialCheckbox;
