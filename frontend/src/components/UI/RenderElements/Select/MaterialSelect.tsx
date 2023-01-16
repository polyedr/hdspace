/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { MDCSelect } from '@material/select';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('select', (theme) => ({
  component: {
    width: '100%',
    height: '100%',
  },
  isOpen: {
    top: '58px',
  },
  icon: ({ element }) => ({
    fill: element.styles.ownStyles.color || theme.palette.primary.main,
  }),
}));

const SelectComponent = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const { isOpen } = element.parameters;
    const [className, groupClass] = element.styles.classNames;
    const eventHandlers = useEventHandlers(props);
    const classes = useStyles(props);

    const [select, setSelect] = useState<any>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      setIsMenuOpen(isOpen);
    }, [isOpen, setIsMenuOpen]);

    useEffect(
      () => () => {
        if (select) {
          select.destroy();
        }
      },
      [select],
    );

    useEffect(() => {
      if (select) {
        select.disabled = isDisabled || false;
      }
    }, [select, isDisabled]);

    return (
      <div
        id={element.id}
        data-ls-id={element.id}
        ref={ref}
        className={cn(
          className,
          classes.root,
          groupClass,
          classes.ownStyles,
          !isDisabled && classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        <div
          ref={(dom: HTMLDivElement) => {
            if (dom && !select) {
              setSelect(new MDCSelect(dom));
              setIsMenuOpen(isOpen); // hook to turn menu back on
            }
          }}
          className={cn(
            `select-${element.id}-component`,
            'mdc-select',
            'mdc-select--outlined',
            classes.component,
          )}
        >
          <input type="hidden" name={element.parameters.name} />
          <div
            className={cn('mdc-select__anchor', isDisabled && classes.disabled)}
          >
            <span className="mdc-notched-outline">
              <span className="mdc-notched-outline__leading" />
              <span className="mdc-notched-outline__trailing" />
            </span>
            <span className="mdc-select__selected-text-container">
              <span className="mdc-select__selected-text" />
            </span>
            <span className="mdc-select__dropdown-icon">
              <svg
                className={cn(
                  classes.icon,
                  'mdc-select__dropdown-icon-graphic',
                )}
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
          </div>

          <div
            className={cn(
              'mdc-select__menu',
              'mdc-menu mdc-menu-surface',
              'mdc-menu-surface--fullwidth',
              ...(isDisabled && isMenuOpen
                ? [
                    'mdc-menu-surface--open',
                    'mdc-menu-surface--is-open-below',
                    classes.isOpen,
                  ]
                : []),
            )}
          >
            <ul
              className="mdc-list"
              role="listbox"
              aria-label={`menu-${element.id}-listbox`}
            >
              {children}
            </ul>
          </div>
        </div>
      </div>
    );
  },
);

export default SelectComponent;
