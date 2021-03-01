import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '@Components/UI/RenderElements/styles';
import useEventHandlers from '@Components/UI/RenderElements/useEventHandlers';
import { TextareaRendererProps } from '../types';

type Props = TextareaRendererProps;

const useStyles = makeComponentStyles('textarea', {});

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const {
    id,
    params: { placeholder },
    isDisabled,
    currentValue,
    className,
    // ownStyles,
    groupClass,
  } = props;

  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  return (
    <textarea
      ref={ref}
      id={id}
      data-ls-id={id}
      rows={4}
      readOnly={isDisabled}
      placeholder={placeholder}
      className={cn(
        className,
        groupClass,
        classes.ownStyles,
        isDisabled && classes.disabled,
      )}
      value={currentValue}
      {...eventHandlers}
      style={{ resize: 'none' }}
    />
  );
});

export default Textarea;
