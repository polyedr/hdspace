import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('textarea', {});

const UnstyledTextarea = React.forwardRef<HTMLTextAreaElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { placeholder, textContent } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <textarea
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        rows={4}
        readOnly={isDisabled}
        placeholder={placeholder}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        defaultValue={textContent}
        {...eventHandlers}
        style={{ resize: 'none' }}
      />
    );
  },
);

export default UnstyledTextarea;
