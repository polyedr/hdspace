// @ts-nocheck

import React, { useState, useCallback } from 'react';
import cn from 'classnames';
import { DEFAULT_COMPONENTS_BACKGROUND } from '@Src/styles/Theme';
import { CheckboxRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

import '@Src/styles/export/material/mdc.checkbox.css';

const useStyles = makeComponentStyles(
  'checkbox',
  {
    root: ({ ownStyles }) => {
      const color = ownStyles.backgroundColor || DEFAULT_COMPONENTS_BACKGROUND;
      return {
        '&:checked ~ .checkbox-background': {
          borderColor: color,
          backgroundColor: color,
        },
      };
    },
    rippleArea: {
      borderRadius: '50%',
    },
  },
  ['backgroundColor', 'width', 'height'],
);

const MUICheckbox: React.FC<CheckboxRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, /* params, */ isDisabled, className, groupClass } = props;
    // const { showRipple } = params;

    const eventHandlers = useEventHandlers(props);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const classes = useStyles({
      ...props,
      isChecked,
    });

    const handleCheckboxChange = useCallback(() => {
      if (!isDisabled) {
        setIsChecked(!isChecked);
      }
    }, [setIsChecked, isChecked, isDisabled]);

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled && classes.disabled,
        )}
        {...eventHandlers}
      >
        <div className="mdc-touch-target-wrapper">
          <div
            className={cn(
              'mdc-checkbox',
              'mdc-checkbox--touch',
              ...(!isDisabled /*  && showRipple */
                ? ['ripple', classes.rippleArea]
                : []),
            )}
          >
            <input
              type="checkbox"
              id={`checkbox-${id}`}
              className={cn('mdc-checkbox__native-control', classes.root)}
              checked={!isDisabled && isChecked}
              onChange={handleCheckboxChange}
            />
            <div
              id={`checkbox-${id}-background`}
              className={cn(
                'mdc-checkbox__background',
                `checkbox-background`,
                isChecked && classes.isChecked,
              )}
            >
              <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                <path
                  className="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"
                />
              </svg>
              <div className="mdc-checkbox__mixedmark" />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default MUICheckbox;
