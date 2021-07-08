import React, { memo } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('button', {});

const MaterialButton = React.forwardRef<HTMLButtonElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { id, parameters, styles } = element;
    const [className, groupClass] = styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <button
        ref={ref}
        type="button"
        id={id}
        data-ls-id={id}
        className={cn(
          'mdc-button',
          'mdc-button--raised',
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        dangerouslySetInnerHTML={{ __html: parameters.textContent }}
        {...eventHandlers}
      />
    );
  },
);

export default memo(MaterialButton);
