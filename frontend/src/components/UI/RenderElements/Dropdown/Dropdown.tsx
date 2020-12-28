// @ts-nocheck

import React, { useState, useCallback, useEffect, useRef } from 'react';
import cn from 'classnames';
import { MDCMenu } from '@material/menu';
import { DropdownRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles({
  root: {
    position: 'relative',
    display: 'inline-block',
  },
  labelWrapper: {
    padding: '6px 17px',
  },
  label: {
    textTransform: 'uppercase',
    fontWeight: 400,
    lineHeight: 1.75,
  },
  menu: {
    top: '37px !important',
    left: '0px !important',
  },
});

const Dropdown: React.FC<DropdownRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, params, children, className } = props;
    const { textContent, showRipple, isOpen } = params;

    const classes = useStyles(props);
    const [mdcMenu, setMdcMenu] = useState<MDCMenu | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLElement | null>(null);

    const handleMenuButtonClick = useCallback(() => {
      if (!isDisabled && mdcMenu) {
        mdcMenu.open = !mdcMenu.open;
      }
    }, [isDisabled, mdcMenu]);

    useEffect(() => {
      if (isDisabled) {
        setOpen(isOpen);
      }
    }, [isOpen, isDisabled]);

    useEffect(() => {
      if (isDisabled && mdcMenu) {
        mdcMenu.destroy();
        setMdcMenu(null);
      }
      if (!isDisabled && !mdcMenu) {
        const menu = new MDCMenu(menuRef.current);
        setMdcMenu(menu);
      }
    }, [isDisabled, mdcMenu]);

    const eventHandlers = useEventHandlers(props, {
      onClick: handleMenuButtonClick,
    });

    return (
      <div
        id={id}
        data-ls-id={id}
        ref={ref}
        className={cn(
          classes.root,
          ...(isDisabled ? [className] : []),
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        {...eventHandlers}
      >
        <div className="mdc-menu-surface--anchor">
          <div className={classes.labelWrapper}>
            <span className={classes.label}>{textContent}</span>
          </div>
          <div
            ref={(dom: HTMLElement) => {
              if (!dom) {
                return;
              }
              menuRef.current = dom;
              if (!isDisabled) {
                if (!mdcMenu) {
                  setMdcMenu(new MDCMenu(dom));
                }
              } else {
                setOpen(isOpen);
              }
            }}
            className={cn(
              'mdc-menu',
              'mdc-menu-surface',
              'mdc-dropdown-menu',
              classes.menu,
              isDisabled && open ? 'mdc-menu-surface--open' : '',
            )}
          >
            {children}
          </div>
        </div>
        {showRipple && <mat-ripple />}
      </div>
    );
  },
);

export default Dropdown;
