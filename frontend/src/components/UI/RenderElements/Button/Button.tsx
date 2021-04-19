import React from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('button', {});

const Button = React.forwardRef<HTMLButtonElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { id, parameters, styles } = element;
    const [className, groupClass] = styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <button
        ref={(dom) => {
          if (typeof ref === 'function') {
            ref(dom);
          } else if (ref) {
            ref.current = dom;
          }
        }}
        type="button"
        id={id}
        data-ls-id={id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled && classes.disabled,
        )}
        {...eventHandlers}
      >
        {parameters.textContent}
      </button>
    );
  },
);

export default Button;
