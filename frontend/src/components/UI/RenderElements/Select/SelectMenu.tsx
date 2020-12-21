// @ts-nocheck
import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';

import '@material/form-field/dist/mdc.form-field.min.css';
import '@material/list/dist/mdc.list.min.css';
import '@material/menu-surface/dist/mdc.menu-surface.min.css';
import '@material/menu/dist/mdc.menu.min.css';
import '@Src/styles/material/mdc.select.css';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles();

const SelectMenu: React.FC<Props> = React.forwardRef((props, ref) => {
  const { id, children } = props;
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);
  return (
    <ul
      id={id}
      data-ls-id={id}
      ref={ref}
      className={cn(
        'mdc-list',
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      role="listbox"
      aria-label={`menu-${id}-listbox`}
      {...eventHandlers}
    >
      {/* React.Children.map(children, (item) => {
        return React.cloneElement(item, {
          selectEntityStyles,
          selectGroupStyles,
          selectOwnStyles,
          selectId,
        });
      }) */}
      {children}
    </ul>
  );
});

export default SelectMenu;
