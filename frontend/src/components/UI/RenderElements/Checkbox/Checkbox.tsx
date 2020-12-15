// @ts-nocheck

import React, { useState } from 'react';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CheckboxRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

import '@material/checkbox/dist/mdc.checkbox.css';

const useCheckboxStyles = makeStyles({
  root: {},
  checked: {},
  entityStyles: ({ entityStyles }) => ({
    color: entityStyles.backgroundColor,
    backgroundColor: entityStyles.backgroundColor,
  }),
  groupStyles: ({ groupStyles }) => ({
    color: groupStyles.backgroundColor,
    backgroundColor: groupStyles.backgroundColor,
  }),
  ownStyles: ({ ownStyles }) => ({
    color: ownStyles.backgroundColor,
    backgroundColor: ownStyles.backgroundColor,
  }),
});

const useDivStyles = makeComponentStyles(
  {},
  ['backgroundColor', 'width', 'height'],
  {
    display: 'inline-block',
  },
);

const Checkbox: React.FC<CheckboxRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, isDisabled, className } = props;
    const { showRipple } = params;
    const divClasses = useDivStyles(props);
    const checkboxClasses = useCheckboxStyles(props);

    const eventHandlers = useEventHandlers(props);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    /* const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isDisabled) {
          setIsChecked(event.target.checked);
        }
      },
      [isDisabled],
    ); */

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          isDisabled && divClasses.disabled,
          divClasses.entityStyles,
          divClasses.groupStyles,
          divClasses.ownStyles,
        )}
        {...eventHandlers}
      >
        <div className="mdc-touch-target-wrapper">
          <div className="mdc-checkbox mdc-checkbox--touch">
            <input
              type="checkbox"
              className={cn(
                'mdc-checkbox__native-control',
                checkboxClasses.entityStyles,
                checkboxClasses.groupStyles,
                checkboxClasses.ownStyles,
              )}
              id="checkbox-1"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <div
              className={cn(
                'mdc-checkbox__background',
                checkboxClasses.entityStyles,
                checkboxClasses.groupStyles,
                checkboxClasses.ownStyles,
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
            {showRipple && <div className="mdc-checkbox__ripple" />}
          </div>
        </div>
      </div>
    );
  },
);

export default Checkbox;
