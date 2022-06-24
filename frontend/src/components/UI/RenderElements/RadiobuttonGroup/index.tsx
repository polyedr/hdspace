import React from 'react';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('radiobuttonGroup', {});

const RadiobuttonGroup = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled, children } = props;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        style={{ width: 'fit-content' }}
        {...eventHandlers}
        {...(isDisabled && {
          onMouseDown: (ev) => {
            ev.preventDefault();
          },
        })}
      >
        {children}
      </div>
    );
  },
);

export default RadiobuttonGroup;
