import React from 'react';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('paragraph');

const Paragraph = React.forwardRef<HTMLParagraphElement, RendererProps>(
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
      <p
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        key={element.id}
        className={cn(className, groupClass, classes.ownStyles)}
        contentEditable={contentEditable}
        {...eventHandlers}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default Paragraph;
