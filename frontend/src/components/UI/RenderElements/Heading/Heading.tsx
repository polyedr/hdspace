import React from 'react';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('heading');

const Heading = React.forwardRef<HTMLHeadingElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { headingType, textContent } = element.parameters;
    const HeadingTag = headingType || 'h3';

    const contentEditableSettings = useContentEditable(element.id, textContent);
    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(
      props,
      contentEditableSettings.events,
    );
    return (
      <HeadingTag
        ref={ref}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          groupClass,
          styles.ownStyles,
          !isDisabled && styles.ownPseudoStyles,
        )}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
        {...contentEditableSettings.props}
        {...eventHandlers}
      />
    );
  },
);

export default Heading;
