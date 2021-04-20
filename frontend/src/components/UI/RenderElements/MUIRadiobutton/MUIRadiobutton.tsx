import React, { useState } from 'react';
import cn from 'classnames';
import { DEFAULT_COMPONENTS_BACKGROUND } from '@Src/styles/Theme';

import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';

import '@Src/styles/export/material/mdc.radio.css';
import { RendererProps } from '../types';

const useDivStyles = makeComponentStyles(
  'radiobutton',
  {
    root: {
      position: 'relative',
      overflow: 'hidden',
      '&:before, &:after': {
        fontSize: 0,
      },
    },
    radio: ({ ownStyles }) => {
      const borderColor =
        ownStyles.backgroundColor || DEFAULT_COMPONENTS_BACKGROUND;
      return {
        '&:checked ~ .mdc-radio__background > .mdc-radio__outer-circle': {
          borderColor,
        },
        '&:checked ~ .mdc-radio__background > .mdc-radio__inner-circle': {
          borderColor,
        },
      };
    },
    rippleArea: {
      borderRadius: '50%',
    },
  },
  ['backgroundColor'],
  {
    display: 'inline-block',
  },
);

const MUIRadiobutton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { name } = element.parameters;

    const classes = useDivStyles(props);

    const [isChecked, setIsChecked] = useState(false);

    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          classes.root,
          groupClass,
          isDisabled && classes.disabled,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        <div className="mdc-touch-target-wrapper">
          <div
            className={cn(
              'mdc-radio',
              'mdc-radio--touch',
              ...(!isDisabled ? ['ripple', classes.rippleArea] : []),
            )}
          >
            <input
              className={cn('mdc-radio__native-control', classes.radio)}
              type="radio"
              id={`radio-${element.id}`}
              name={`${name}-${element.id}`}
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

export default MUIRadiobutton;
