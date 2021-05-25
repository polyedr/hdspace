import React, { useState } from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('radiobutton', {});

const MaterialRadiobutton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const eventHandlers = useEventHandlers(props, {});

    return (
      <div
        ref={ref}
        className={cn(
          'mdc-touch-target-wrapper',
          className,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          classes.ownStyles,
        )}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        <div className="mdc-radio mdc-radio--touch">
          <input
            id={element.id}
            className="mdc-radio__native-control"
            type="radio"
            name={element.name}
            checked={isChecked}
            onChange={() => {
              if (!isDisabled && isChecked) {
                setIsChecked(!isChecked);
              }
            }}
          />
          <div className="mdc-radio__background">
            <div className="mdc-radio__outer-circle" />
            <div className="mdc-radio__inner-circle" />
          </div>
          <div className="mdc-radio__ripple" />
        </div>
      </div>
    );
  },
);

export default MaterialRadiobutton;
