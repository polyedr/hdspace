import React from 'react';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('label', {
  label: {
    wordBreak: 'break-word',
    cursor: 'default',
    outline: 0,
  },
});

const Label = React.forwardRef<HTMLLabelElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { labelFor, textContent, isLink, link } = element.parameters;
    const styles = useStyles(props);
    const contentEditableSettings = useContentEditable(element.id, textContent);
    const eventHandlers = useEventHandlers(
      props,
      contentEditableSettings.events,
    );

    return (
      <>
        {isLink ? (
          <a
            aria-label={`Link-${element.id}`}
            href={link}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          />
        ) : (
          <label
            ref={ref}
            id={element.id}
            data-ls-id={element.id}
            {...(labelFor !== 'no for attribute' && { htmlFor: labelFor })}
            className={cn(
              className,
              styles.label,
              groupClass,
              styles.ownStyles,
              !isDisabled && styles.ownPseudoStyles,
            )}
            dangerouslySetInnerHTML={{ __html: textContent }}
            data-gramm_editor={false}
            {...contentEditableSettings.props}
            {...eventHandlers}
          />
        )}
      </>
    );
  },
);

export default Label;
