import React, { memo } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('button', {});

const ChildrenButton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const classes = useStyles(props);
    const { element, isDisabled } = props;
    const {
      id,
      parameters: { textContent, isLink, link },
      styles,
    } = element;

    const [className, groupClass] = styles.classNames;
    const contentEditableSettings = useContentEditable(id, textContent);
    const eventHandlers = useEventHandlers(
      props,
      contentEditableSettings.events,
    );

    const mainClasses = cn(
      props.style,
      className,
      groupClass,
      isDisabled ? classes.disabled : classes.ownPseudoStyles,
    );

    return (
      <>
        {isLink ? (
          <div
            ref={ref}
            id={id}
            data-ls-id={id}
            data-gramm_editor={false}
            {...eventHandlers}
          >
            <a
              aria-label={`Link-${element.id}`}
              href={link}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
              className={mainClasses}
              target="_blank"
              rel="noreferrer"
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...contentEditableSettings.props}
              {...contentEditableSettings.events}
            />
          </div>
        ) : (
          <div ref={ref} className={classes.ownStyles}>
            <button
              type="button"
              id={id}
              data-ls-id={id}
              className={mainClasses}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...eventHandlers}
            />
          </div>
        )}
      </>
    );
  },
);

export default memo(ChildrenButton);
