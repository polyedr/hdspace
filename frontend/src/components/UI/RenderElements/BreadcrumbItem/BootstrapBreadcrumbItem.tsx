import React, { LegacyRef } from 'react';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('breadcrumb', {});

const BootstrapBreadcrumbItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isLink, isActiveLink } = element.parameters;
    const classes = useStyles(props);

    const contentEditableSettings = useContentEditable(element.id, textContent);
    const eventHandlers = useEventHandlers<HTMLElement>(props, {
      onClick: (event: React.SyntheticEvent<HTMLElement>) => {
        if (isDisabled) {
          (event.target as HTMLElement).focus();
        }
      },
    });
    return (
      <>
        {isLink ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              'breadcrumb-item',
              { active: isActiveLink },
              classes.ownStyles,
              groupClass,
            )}
            aria-current="page"
            {...eventHandlers}
            data-gramm_editor={false}
          >
            <a
              href={link}
              aria-label={`Link-${element.id}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...contentEditableSettings.props}
              {...contentEditableSettings.events}
              target="_blank"
              rel="noreferrer"
            />
          </li>
        ) : (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              'breadcrumb-item',
              { active: isActiveLink },
              classes.ownStyles,
              groupClass,
            )}
            aria-current="page"
            dangerouslySetInnerHTML={{ __html: textContent }}
            data-gramm_editor={false}
            {...eventHandlers}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          />
        )}
      </>
    );
  },
);

export default BootstrapBreadcrumbItem;
