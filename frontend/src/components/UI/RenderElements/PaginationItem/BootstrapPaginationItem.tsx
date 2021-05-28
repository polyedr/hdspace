import React, { LegacyRef } from 'react';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('pagination', {});

const BootstrapPaginationItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isActiveLink } = element.parameters;
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
        <li
          ref={ref as LegacyRef<HTMLLIElement>}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            'page-item',
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
            className="page-link"
          />
        </li>
      </>
    );
  },
);

export default BootstrapPaginationItem;
