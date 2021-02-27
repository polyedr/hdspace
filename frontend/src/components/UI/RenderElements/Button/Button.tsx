import React from 'react';
import useEventHandlers from '@Components/UI/RenderElements/useEventHandlers';
import cn from 'classnames';
import { ButtonRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('button', {});

type Props = ButtonRendererProps;

const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { id, /* isDisabled, */ params, className, groupClass } = props;
  const { textContent } = params || {};

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
      className={cn(className, groupClass, classes.ownStyles)}
      {...eventHandlers}
    >
      {textContent}
    </button>
  );
});

export default Button;
