import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('select-item', {
  root: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
});

const MaterialOption = React.forwardRef<HTMLLIElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { name } = element.parameters;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <li
        id={element.id}
        ref={ref}
        data-ls-id={element.id}
        className={cn(
          'mdc-list-item',
          className,
          classes.root,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        aria-selected="false"
        data-value="grains"
        role="option"
        {...eventHandlers}
      >
        <span className="mdc-list-item__text">{name}</span>
      </li>
    );
  },
);

export default MaterialOption;
