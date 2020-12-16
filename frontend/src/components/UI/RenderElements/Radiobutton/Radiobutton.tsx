// @ts-nocheck

import React, { useState } from 'react';
import cn from 'classnames';
import Style from 'style-it';

import { RadioRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles, makeInlineStyles } from '../styles';

import '@Src/styles/material/mdc.radio.css';

const useDivStyles = makeComponentStyles(
  {
    root: {
      position: 'relative',
      overflow: 'hidden',
      '&:before, &:after': {
        fontSize: 0,
      },
    },
  },
  ['backgroundColor'],
  {
    display: 'inline-block',
  },
);

const useInlineStyles = makeInlineStyles((styles: React.CSSProperties) => ({
  color: styles.backgroundColor,
}));

const Radiobutton: React.FC<RadioRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, name, params, isDisabled, className } = props;
    const { showRipple } = params;

    const divClasses = useDivStyles(props);
    const inlineStyles = useInlineStyles(props);

    const [isChecked, setIsChecked] = useState(false);

    const eventHandlers = useEventHandlers(props);

    return Style.it(
      `#radio-${id}:checked ~ #radio-${id}-background > .mdc-radio__outer-circle {
        border-color: ${inlineStyles.color};
      }
      #radio-${id}:checked ~ #radio-${id}-background > .mdc-radio__inner-circle {
        border-color: ${inlineStyles.color};
      }`,
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          divClasses.root,
          isDisabled && divClasses.disabled,
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
        {...eventHandlers}
      >
        <div className="mdc-touch-target-wrapper">
          <div className="mdc-radio mdc-radio--touch">
            {showRipple && (
              <mat-ripple
                centered
                color={`${inlineStyles.color || '#1890ff'}33`}
                style={{
                  borderRadius: '50%',
                }}
              />
            )}
            <input
              className="mdc-radio__native-control"
              type="radio"
              id={`radio-${id}`}
              name={`${name}-${id}`}
              checked={!isDisabled && isChecked}
              onChange={() => {
                if (!isDisabled && !isChecked) {
                  setIsChecked(!isChecked);
                }
              }}
            />
            <div
              id={`radio-${id}-background`}
              className="mdc-radio__background"
            >
              <div className="mdc-radio__outer-circle" />
              <div className="mdc-radio__inner-circle" />
            </div>
          </div>
        </div>
      </div>,
    );
  },
);

export default Radiobutton;

/* <Radio
          checkedIcon={
            <RadioButtonCheckedIcon
              className={cn(
                iconClasses.entityStyles,
                iconClasses.groupStyles,
                iconClasses.ownStyles,
              )}
            />
          }
          icon={
            <RadioButtonUncheckedIcon
              className={cn(
                iconClasses.entityStyles,
                iconClasses.groupStyles,
                iconClasses.ownStyles,
              )}
            />
          }
          color="default"
          className={cn(
            radiobuttonClasses.root,
            radiobuttonClasses.entityStyles,
            radiobuttonClasses.groupStyles,
            radiobuttonClasses.ownStyles,
          )}
          checked={!isDisabled && isChecked}
          onChange={handleChange}
          disableRipple={!showRipple}
        /> */
