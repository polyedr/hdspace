import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MDCMenu } from '@material/menu';
import cn from 'classnames';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mat-ripple': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const useStyles = makeComponentStyles('dropdown', {
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

const Dropdown = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const { textContent, showRipple, isOpen } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

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
      if (!isDisabled && !mdcMenu && menuRef.current) {
        const menu = new MDCMenu(menuRef.current);
        setMdcMenu(menu);
      }
    }, [isDisabled, mdcMenu]);

    const eventHandlers = useEventHandlers(props, {
      onClick: handleMenuButtonClick,
    });

    return (
      <div
        id={element.id}
        data-ls-id={element.id}
        ref={ref}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        <div className="mdc-menu-surface--anchor">
          <div className={classes.labelWrapper}>
            <span className={classes.label}>{textContent}</span>
          </div>
          <div
            ref={(dom) => {
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
