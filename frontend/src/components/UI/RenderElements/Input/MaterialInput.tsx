/* eslint-disable */
import React, { memo } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('input', {});

const MaterialInput = React.forwardRef<HTMLLabelElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const {
      type = 'text',
      placeholder,
      textContent,
      label,
    } = element.parameters;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <label
        ref={ref}
        data-ls-id={element.id}
        className={cn(
          'mdc-text-field',
          'mdc-text-field--outlined',
          'mdc-text-field--no-label',
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
      >
        <span className="mdc-notched-outline">
          <span className="mdc-notched-outline__leading" />
          <span className="mdc-notched-outline__trailing" />
        </span>
        <input
          id={element.id}
          className="mdc-text-field__input"
          type={type}
          readOnly={isDisabled}
          defaultValue={textContent}
          placeholder={placeholder}
          {...eventHandlers}
        />
      </label>
    );
  },
);

export default memo(MaterialInput);
