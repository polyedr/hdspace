import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('select', {});

const MaterialSelect = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { id } = element;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    /* return (
      <div className="input-field col s12">
        <select
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            className,
            groupClass,
            classes.ownStyles,
            isDisabled && classes.disabled,
          )}
          {...eventHandlers}
          {...(isDisabled && {
            onMouseDown: (ev) => {
              ev.preventDefault();
            },
          })}
        >
          {children}
        </select>
      </div>
    ); */
    return (
      <div
        data-ls-id={id}
        ref={ref}
        className={cn(
          'mdc-select',
          'mdc-select--filled',
          'demo-width-class',
          className,
          groupClass,
          classes.ownStyles,
          isDisabled && classes.disabled,
        )}
        {...eventHandlers}
      >
        <div
          className="mdc-select__anchor"
          role="button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-labelledby="demo-label demo-selected-text"
        >
          <span className="mdc-select__ripple" />
          <span id="demo-label" className="mdc-floating-label">
            Pick a Food Group
          </span>
          <span className="mdc-select__selected-text-container">
            <span
              id="demo-selected-text"
              className="mdc-select__selected-text"
            />
          </span>
          <span className="mdc-select__dropdown-icon">
            <svg
              className="mdc-select__dropdown-icon-graphic"
              viewBox="7 10 10 5"
              focusable="false"
            >
              <polygon
                className="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fillRule="evenodd"
                points="7 10 12 15 17 10"
              />
              <polygon
                className="mdc-select__dropdown-icon-active"
                stroke="none"
                fillRule="evenodd"
                points="7 15 12 10 17 15"
              />
            </svg>
          </span>
          <span className="mdc-line-ripple" />
        </div>

        <div className="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
          <ul
            className="mdc-list"
            role="listbox"
            aria-label="Food picker listbox"
          >
            <li
              className="mdc-list-item"
              aria-selected="false"
              data-value="grains"
              role="option"
            >
              <span className="mdc-list-item__ripple" />
              <span className="mdc-list-item__text">
                Bread, Cereal, Rice, and Pasta
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  },
);

export default MaterialSelect;
