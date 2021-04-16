import React from 'react';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('heading');

const Heading = React.forwardRef<HTMLHeadingElement, RendererProps>(
  (props, ref) => {
    const { element } = props;
    const [className, groupClass] = element.styles.classNames;
    const { headingType, textContent } = element.parameters;
    const HeadingTag = headingType || 'h3';

    const [contentEditable, handleResetState] = useContentEditable(element.id);
    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props, {
      onBlur: handleResetState,
    });

    return (
      <HeadingTag
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(className, styles.ownStyles, groupClass)}
        {...eventHandlers}
        contentEditable={contentEditable}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default Heading;
