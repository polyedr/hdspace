// @ts-nocheck

import React, { useState } from 'react';
import cn from 'classnames';

import { RadioRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles, makeInlineStyles } from '../styles';

import '@Src/styles/export/material/mdc.radio.css';

const useDivStyles = makeComponentStyles(
  {
    root: {
      position: 'relative',
      overflow: 'hidden',
      '&:before, &:after': {
        fontSize: 0,
      },
    },
    radio: ({ entityStyles, groupStyles, ownStyles }) => {
      const borderColor =
        ownStyles.backgroundColor ||
        groupStyles.backgroundColor ||
        entityStyles.backgroundColor;
      if (!borderColor) {
        return {};
      }
      return {
        '&:checked ~ .mdc-radio__background > .mdc-radio__outer-circle': {
          borderColor,
        },
        '&:checked ~ .mdc-radio__background > .mdc-radio__inner-circle': {
          borderColor,
        },
      };
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

    const classes = useDivStyles(props);
    const inlineStyles = useInlineStyles(props);

    const [isChecked, setIsChecked] = useState(false);

    const eventHandlers = useEventHandlers(props);

    return (
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
              className={cn('mdc-radio__native-control', classes.radio)}
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
            <div className="mdc-radio__background">
              <div className="mdc-radio__outer-circle" />
              <div className="mdc-radio__inner-circle" />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default Radiobutton;
