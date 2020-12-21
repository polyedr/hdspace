// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { SharedRendererProps } from '../types';

import '@material/form-field/dist/mdc.form-field.min.css';
import '@material/list/dist/mdc.list.min.css';
import '@material/menu-surface/dist/mdc.menu-surface.min.css';
import '@material/menu/dist/mdc.menu.min.css';
import '@Src/styles/material/mdc.select.css';
import useEventHandlers from '../useEventHandlers';

type Props = SharedRendererProps & {
  // item: StateElement;
  id: string;
  name: string;
  value: string;
  showRipple: boolean;
  children: React.Component[];
};

const useStyles = makeComponentStyles({
  root: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
});

const SelectItem: React.FC<Props> = React.forwardRef((props, ref) => {
  const {
    id,
    params: { name },
    isDisabled,
    className,
  } = props;
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <li
      id={id}
      ref={ref}
      data-ls-id={id}
      className={cn(
        'mdc-list-item',
        className,
        classes.root,
        isDisabled && classes.disabled,
        classes.entityStyles,
        classes.groupStyles,
        classes.ownStyles,
      )}
      aria-selected="false"
      data-value="grains"
      role="option"
      {...eventHandlers}
    >
      <span className="mdc-list-item__text">{name}</span>
    </li>
  );
});

export default SelectItem;
