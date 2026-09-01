/* eslint-disable */
import React from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('textarea', {});

const MaterialTextarea = React.forwardRef<HTMLLabelElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { placeholder, textContent, label } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <label
        className="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea mdc-text-field--no-label"
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        <span className="mdc-notched-outline">
          <span className="mdc-notched-outline__leading" />
          <span className="mdc-notched-outline__trailing" />
        </span>
        <span className="mdc-text-field__resizer">
          <textarea
            rows={4}
            className={cn(
              'mdc-text-field__input',
              className,
              groupClass,
              classes.ownStyles,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
            )}
            aria-label={`${element.name}-${element.id}`}
            defaultValue={textContent}
            style={{ resize: 'none' }}
            readOnly={isDisabled}
            placeholder={placeholder}
          />
        </span>
      </label>
    );
  },
);

export default MaterialTextarea;
