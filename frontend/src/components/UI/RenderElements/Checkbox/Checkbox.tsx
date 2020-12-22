// @ts-nocheck

import React, { useState, useCallback } from 'react';
import cn from 'classnames';
import Style from 'style-it';
import { CheckboxRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles, makeInlineStyles } from '../styles';

import '@Src/styles/material/mdc.checkbox.css';

const useStyles = makeComponentStyles(
  {
    root: {
      overflow: 'hidden',
    },
    isChecked: ({ entityStyles, groupStyles, ownStyles }) => {
      const colorValue =
        ownStyles.backgroundColor ||
        groupStyles.backgroundColor ||
        entityStyles.backgroundColor;
      if (!colorValue) {
        return {};
      }
      return {
        color: colorValue,
        backgroundColor: colorValue,
      };
    },
  },
  ['backgroundColor', 'width', 'height'],
  {
    display: 'inline-block',
  },
);

const useInlineStyles = makeInlineStyles((styles: React.CSSProperties) => ({
  color: styles.backgroundColor,
}));

const Checkbox: React.FC<CheckboxRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, name, params, isDisabled, className } = props;
    const { showRipple } = params;

    const inlineStyles = useInlineStyles(props);

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

    return Style.it(
      `#checkbox-${id}:checked ~ #checkbox-${id}-background {
        border-color: ${inlineStyles.color};
        background-color: ${inlineStyles.color};
      }`,
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          classes.root,
          isDisabled && classes.disabled,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        <div className="mdc-touch-target-wrapper">
          <div className="mdc-checkbox mdc-checkbox--touch">
            {showRipple && (
              <mat-ripple
                centered
                color={`${inlineStyles.color || '#1890ff'}`}
                style={{
                  borderRadius: '50%',
                  opacity: 0.2,
                }}
              />
            )}
            <input
              type="checkbox"
              id={`checkbox-${id}`}
              name={`${name}-${id}`}
              className="mdc-checkbox__native-control"
              checked={!isDisabled && isChecked}
              onChange={handleCheckboxChange}
            />
            <div
              id={`checkbox-${id}-background`}
              className={cn(
                'mdc-checkbox__background',
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
      </div>,
    );
  },
);

export default Checkbox;
