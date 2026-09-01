import React from 'react';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

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

const DropdownItem = React.forwardRef<HTMLLIElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { textContent } = element.parameters;

    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <li
        id={element.id}
        data-ls-id={element.id}
        ref={ref}
        className={cn(
          styles.root,
          className,
          groupClass,
          styles.ownStyles,
          isDisabled ? styles.disabled : styles.ownPseudoStyles,
        )}
        {...(isDisabled ? eventHandlers : {})}
      >
        {textContent}
      </li>
    );
  },
);

export default DropdownItem;
