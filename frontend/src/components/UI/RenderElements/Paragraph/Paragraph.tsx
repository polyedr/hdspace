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
    const contentEditableSettings = useContentEditable(element.id, textContent);
    const eventHandlers = useEventHandlers(
      props,
      contentEditableSettings.events,
    );

    return (
      <p
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        key={element.id}
        className={cn(className, groupClass, classes.ownStyles)}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
        {...contentEditableSettings.props}
        {...eventHandlers}
      />
    );
  },
);

export default Paragraph;
