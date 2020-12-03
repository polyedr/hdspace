// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import { DropdownMenuRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';
import { DropdownContext } from '../Dropdown/Dropdown';

const useStyles = makeComponentStyles({
  root: {
    position: 'absolute',
    top: '0',
    left: '0',
    overflow: 'hidden',
    zIndex: 1,
    margin: 0,
    padding: 0,
  },
});

const DropdownMenu: React.FC<DropdownMenuRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, children, isDisabled, className } = props;
    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const clickHandler = eventHandlers.onClick;

    eventHandlers.onClick = (event: React.MouseEvent<HTMLDivElement>) => {
      (event.target as HTMLElement).focus();
      if (clickHandler) {
        clickHandler(event);
      }
    };

    return (
      <DropdownContext.Consumer>
        {({ anchorRef, open, setOpen }) => {
          return !anchorRef?.current ? null : (
            <Popper
              id={id}
              data-ls-id={id}
              ref={ref}
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
              placement="bottom-start"
              {...eventHandlers}
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'left top' : 'left bottom',
                  }}
                >
                  <Paper
                    className={cn(
                      className,
                      styles.addedElem,
                      styles.root,
                      styles.entityStyles,
                      styles.groupStyles,
                      styles.ownStyles,
                    )}
                    elevation={8}
                  >
                    <ClickAwayListener
                      onClickAway={() => {
                        if (!isDisabled) {
                          setOpen(false);
                        }
                      }}
                    >
                      <MenuList id="menu-list-grow">{children}</MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          );
        }}
      </DropdownContext.Consumer>
    );
  },
);

export default DropdownMenu;
