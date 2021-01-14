// @ts-nocheck

import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import cn from 'classnames';
import { MDCSelect } from '@material/select';

import '@material/form-field/dist/mdc.form-field.min.css';
import '@material/list/dist/mdc.list.min.css';
import '@material/menu-surface/dist/mdc.menu-surface.min.css';
import '@material/menu/dist/mdc.menu.min.css';
import '@Src/styles/export/material/mdc.select.css';

import { SelectRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('select', (theme) => ({
  component: {
    width: '100%',
    height: '100%',
  },
  isOpen: {
    top: '58px',
  },
  icon: ({ ownStyles }) => ({
    fill: ownStyles.color || theme.palette.primary.main,
  }),
}));

const SelectComponent: React.FC<SelectRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      name,
      isDisabled,
      params,
      className,
      children,
      groupClass,
    } = props;
    const { isOpen } = params;
    const eventHandlers = useEventHandlers(props);
    const classes = useStyles(props);

    const [mdcSelect, setMdcSelect] = useState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
      setIsMenuOpen(isOpen);
    }, [isOpen, setIsMenuOpen]);

    useEffect(() => {
      return () => {
        if (mdcSelect) {
          mdcSelect.destroy();
        }
      };
    }, [mdcSelect]);

    useEffect(() => {
      if (mdcSelect) {
        mdcSelect.disabled = isDisabled;
      }
    }, [mdcSelect, isDisabled]);

    return (
      <div
        id={id}
        data-ls-id={id}
        key={id}
        ref={ref}
        className={cn(className, classes.root, groupClass, classes.ownStyles)}
        {...eventHandlers}
      >
        <div
          ref={(dom: HTMLElement) => {
            if (dom && !mdcSelect) {
              setMdcSelect(new MDCSelect(dom));
              setIsMenuOpen(isOpen); // hook to turn menu back on
            }
          }}
          className={cn(
            `select-${id}-component`,
            'mdc-select',
            'mdc-select--outlined',
            classes.component,
          )}
        >
          <input type="hidden" name={name} />
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
            {children}
          </div>
        </div>
      </div>
    );
  },
);

export default SelectComponent;
