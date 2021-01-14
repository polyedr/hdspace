// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { DropdownItemRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('dropdown-item', {
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
    const { id, isDisabled, params, className, groupClass } = props;
    const { textContent } = params;

    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <li
        id={id}
        data-ls-id={id}
        ref={ref}
        className={cn(
          styles.root,
          className,
          groupClass,
          ...(isDisabled ? [className, styles.disabled] : []),
          styles.ownStyles,
        )}
        {...(isDisabled ? eventHandlers : {})}
      >
        {textContent}
      </li>
    );
  },
);

export default DropdownItem;
