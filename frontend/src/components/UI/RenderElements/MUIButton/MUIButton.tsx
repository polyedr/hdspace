import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('button', {
  root: ({ isDisabled, ownStyles }) => {
    const { color, backgroundColor } = ownStyles || {};
    return {
      textTransform: 'uppercase',
      outline: 0,
      '&:hover, &:active': {
        ...(isDisabled && {
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
          color,
          backgroundColor,
        }),
      },
    };
  },
});

const MUIButton = React.forwardRef<HTMLButtonElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const { textContent } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <button
        type="button"
        ref={(dom) => {
          if (typeof ref === 'function') {
            ref(dom);
          } else if (ref) {
            ref.current = dom;
          }
        }}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          'mdc-button',
          // !isDisabled && showRipple ? 'ripple' : '',
          className,
          classes.root,
          groupClass,
          isDisabled && classes.disabled,
          classes.ownStyles,
        )}
        {...eventHandlers}
        dangerouslySetInnerHTML={{ __html: textContent }}
      />
    );
  },
);

export default MUIButton;
