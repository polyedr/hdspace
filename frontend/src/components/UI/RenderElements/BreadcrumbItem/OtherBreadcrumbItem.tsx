import React, { LegacyRef } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('breadcrumb', {
  li: {
    display: 'inline',
    '& + li:before': {
      padding: '8px',
      color: 'black',
      content: '"/"',
    },
    '& a': {
      color: 'green',
    },
  },
});

const OtherBreadcrumbItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isLink } = element.parameters;
    const classes = useStyles(props);

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
            className={cn(classes.li, classes.ownStyles, groupClass)}
            {...eventHandlers}
          >
            <a
              href={link}
              aria-label={`Link-${element.id}`}
              target="_blank"
              rel="noreferrer"
            >
              {textContent}
            </a>
          </li>
        ) : (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(classes.li, classes.ownStyles, groupClass)}
            {...eventHandlers}
          >
            {textContent}
          </li>
        )}
      </>
    );
  },
);

export default OtherBreadcrumbItem;
