// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';
import * as R from 'ramda';
import { ListItemRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const omitEditableStyles = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
];
const omitLinkStyles = [
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'backgroundColor',
];

const useItemStyles = makeComponentStyles('list-item');

const useEditableItemStyles = makeStyles({
  ownStyles: ({ ownStyles }) => R.omit(omitEditableStyles, ownStyles),
});

const useLinkStyles = makeStyles({
  ownStyles: ({ ownStyles }) => R.omit(omitLinkStyles, ownStyles),
  link: {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    outline: 0,
  },
});

const ListItem: React.FC<ListItemRendererProps> = React.forwardRef(
  (props, ref) => {
    const {
      id,
      params,
      isDisabled,
      className,
      groupClass,
      contentEditable,
    } = props;
    const { textContent, isLink, link } = params;

    const listItemClasses = useItemStyles(props);
    const listItemWithLinkClasses = useEditableItemStyles(props);
    const linkClasses = useLinkStyles(props);
    const eventHandlers = useEventHandlers(props);

    const clickHandler = eventHandlers.onClick;
    eventHandlers.onClick = (event: React.MouseEvent<HTMLLIElement>) => {
      if (isDisabled) {
        (event.target as HTMLElement).focus();
      }
      if (clickHandler) {
        clickHandler(event);
      }
    };

    return (
      <>
        {isLink ? (
          <li
            ref={ref}
            id={id}
            data-ls-id={id}
            className={cn(
              className,
              isDisabled && listItemClasses.disabled,
              groupClass,
              listItemWithLinkClasses.ownStyles,
            )}
            {...eventHandlers}
          >
            <a
              className={cn(
                linkClasses.link,
                groupClass,
                linkClasses.ownStyles,
              )}
              aria-label={`Link-${id}`}
              href={link}
              target="_blank"
              rel="noreferrer"
              contentEditable={contentEditable}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          </li>
        ) : (
          <li
            ref={ref}
            id={id}
            data-ls-id={id}
            className={cn(
              className,
              isDisabled && listItemClasses.disabled,
              groupClass,
              listItemClasses.ownStyles,
            )}
            aria-label={`Button-${id}`}
            {...eventHandlers}
            contentEditable={contentEditable}
            dangerouslySetInnerHTML={{ __html: textContent }}
            data-gramm_editor={false}
          />
        )}
      </>
    );
  },
);

export default ListItem;
