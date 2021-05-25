import React from 'react';
import cn from 'classnames';

import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('text', {
  wordBreak: 'break-word',
});

const TextBlock = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { textContent } = element.parameters;

    const classes = useStyles(props);
    const contentEditableSettings = useContentEditable(element.id, textContent);
    const eventHandlers = useEventHandlers(
      props,
      contentEditableSettings.events,
    );

    return (
      <div
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          classes.textBlock,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
        {...contentEditableSettings.props}
        {...eventHandlers}
      />
    );
  },
);

export default TextBlock;
