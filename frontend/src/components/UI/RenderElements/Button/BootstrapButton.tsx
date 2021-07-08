import React, { memo } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('button', {});

const BootstrapButton = React.forwardRef<any, RendererProps>((props, ref) => {
  const { element, isDisabled } = props;
  const { id, parameters, styles } = element;
  const { textContent, isLink, link } = parameters;
  const [className, groupClass] = styles.classNames;

  const classes = useStyles(props);

  const contentEditableSettings = useContentEditable(element.id, textContent);
  const eventHandlers = useEventHandlers(props, contentEditableSettings.events);

  return (
    <>
      {isLink ? (
        <div
          ref={ref}
          id={element.id}
          data-ls-id={element.id}
          data-gramm_editor={false}
          {...eventHandlers}
        >
          <a
            aria-label={`Link-${element.id}`}
            href={link}
            style={{ textDecoration: 'none' }}
            className={cn(
              'btn',
              'btn-primary',
              className,
              groupClass,
              classes.ownStyles,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
            )}
            target="_blank"
            rel="noreferrer"
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          />
        </div>
      ) : (
        <button
          ref={ref}
          type="button"
          id={id}
          data-ls-id={id}
          className={cn(
            'btn',
            'btn-primary',
            className,
            groupClass,
            classes.ownStyles,
            isDisabled ? classes.disabled : classes.ownPseudoStyles,
          )}
          dangerouslySetInnerHTML={{ __html: textContent }}
          {...eventHandlers}
        />
      )}
    </>
  );
});

export default memo(BootstrapButton);
