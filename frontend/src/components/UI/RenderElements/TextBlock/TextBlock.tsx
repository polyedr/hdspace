import React from 'react';
import cn from 'classnames';

import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('text', [], {
  wordBreak: 'break-word',
});

const TextBlock = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element } = props;
    const [className, groupClass] = element.styles.classNames;
    const { textContent } = element.parameters;

    const classes = useStyles(props);
    const [contentEditable, handleResetState] = useContentEditable(element.id);
    const eventHandlers = useEventHandlers(props, {
      onBlur: handleResetState,
    });

    return (
      <div
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        contentEditable={contentEditable}
        className={cn(
          className,
          classes.textBlock,
          groupClass,
          classes.ownStyles,
        )}
        {...eventHandlers}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default TextBlock;
