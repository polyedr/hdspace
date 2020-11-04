// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { MenuItem } from '@material-ui/core';
import { DropdownItemRendererProps } from '../types';

import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  'item:hover': ({ isDisabled }) => {
    if (isDisabled) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      };
    }
    return {};
  },
});

const DropdownItem: React.FC<DropdownItemRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, params, className } = props;
    const { showRipple, textContent } = params;

    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return isDisabled ? (
      <MenuItem
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          styles.root,
          className,
          styles.addedElem,
          styles.disabled,
          styles.entityStyles,
          styles.groupStyles,
          styles.ownStyles,
        )}
        disableRipple
        {...eventHandlers}
      >
        {textContent}
      </MenuItem>
    ) : (
      <MenuItem
        key={id}
        className={cn(
          styles.root,
          styles.entityStyles,
          styles.groupStyles,
          styles.ownStyles,
        )}
        disableRipple={!showRipple}
      >
        {textContent}
      </MenuItem>
    );
  },
);

export default DropdownItem;
