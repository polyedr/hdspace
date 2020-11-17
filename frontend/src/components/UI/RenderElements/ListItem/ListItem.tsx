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

const useItemStyles = makeComponentStyles();

const useEditableItemStyles = makeStyles({
  entityStyles: ({ entityStyles }) => R.omit(omitEditableStyles, entityStyles),
  groupStyles: ({ groupStyles }) => R.omit(omitEditableStyles, groupStyles),
  ownStyles: ({ ownStyles }) => R.omit(omitEditableStyles, ownStyles),
});

const useLinkStyles = makeStyles({
  entityStyles: ({ entityStyles }) => R.omit(omitLinkStyles, entityStyles),
  groupStyles: ({ groupStyles }) => R.omit(omitLinkStyles, groupStyles),
  ownStyles: ({ ownStyles }) => R.omit(omitLinkStyles, ownStyles),
  link: {
    width: '100%',
    height: '100%',
    display: 'inline-block',
  },
});

const ListItem: React.FC<ListItemRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, isDisabled, className, contentEditable } = props;
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
              listItemClasses.addedElem,
              isDisabled && listItemClasses.disabled,
              listItemWithLinkClasses.entityStyles,
              listItemWithLinkClasses.groupStyles,
              listItemWithLinkClasses.ownStyles,
            )}
            {...eventHandlers}
          >
            <a
              className={cn(
                linkClasses.link,
                linkClasses.entityStyles,
                linkClasses.groupStyles,
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
              listItemClasses.addedElem,
              isDisabled && listItemClasses.disabled,
              listItemClasses.entityStyles,
              listItemClasses.groupStyles,
              listItemClasses.ownStyles,
            )}
            aria-label={`Button-${id}`}
            {...eventHandlers}
            contentEditable={contentEditable}
            dangerouslySetInnerHTML={{ __html: textContent }}
          />
        )}
      </>
    );
  },
);

export default ListItem;
