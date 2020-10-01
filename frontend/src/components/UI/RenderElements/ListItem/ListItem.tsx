/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';
import * as R from 'ramda';
import { ListItemRendererProps } from '../types';
import sharedClasses from '../../../../styles/sharedClasses';

const styles = require('../styles.scss');

const getListItemStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...entityStyles,
    },

    groupStyles: {
      ...groupStyles,
    },

    ownStyles: {
      ...ownStyles,
    },
  });

const getEditableListItemStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...R.omit(
        ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        entityStyles,
      ),
    },

    groupStyles: {
      ...R.omit(
        ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        groupStyles,
      ),
    },

    ownStyles: {
      ...R.omit(
        ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        ownStyles,
      ),
    },
  });

const getLinkStyles = (
  entityStyles: React.CSSProperties,
  groupStyles: React.CSSProperties,
  ownStyles: React.CSSProperties,
) =>
  makeStyles({
    entityStyles: {
      ...R.omit(
        [
          'marginTop',
          'marginRight',
          'marginBottom',
          'marginLeft',
          'borderWidth',
          'borderColor',
          'borderStyle',
          'backgroundColor',
        ],
        entityStyles,
      ),
      width: '100%',
      height: '100%',
      display: 'inline-block',
    },

    groupStyles: {
      ...R.omit(
        [
          'marginTop',
          'marginRight',
          'marginBottom',
          'marginLeft',
          'borderWidth',
          'borderColor',
          'borderStyle',
          'backgroundColor',
        ],
        groupStyles,
      ),
      width: '100%',
      height: '100%',
      display: 'inline-block',
    },

    ownStyles: {
      ...R.omit(
        [
          'marginTop',
          'marginRight',
          'marginBottom',
          'marginLeft',
          'borderWidth',
          'borderColor',
          'borderStyle',
          'backgroundColor',
        ],
        ownStyles,
      ),
      width: '100%',
      height: '100%',
      display: 'inline-block',
    },
  });

const ListItem: React.FC<ListItemRendererProps> = React.forwardRef(
  (
    { id, entityStyles, groupStyles, ownStyles, params, isDisabled, className },
    ref,
  ) => {
    const { textContent, isLink, link } = params;

    const handleListItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
      (event.target as HTMLElement).focus();
    };

    const listItemClasses = getListItemStyles(
      entityStyles,
      groupStyles,
      ownStyles,
    )();
    const listItemWithLinkClasses = getEditableListItemStyles(
      entityStyles,
      groupStyles,
      ownStyles,
    )();
    const linkClasses = getLinkStyles(entityStyles, groupStyles, ownStyles)();

    return (
      <>
        {isLink ? (
          <li
            ref={ref}
            id={id}
            data-ls-id={id}
            className={cn(
              className,
              sharedClasses.lsItem,
              sharedClasses.unsortable,
              styles.addedElem,
              isDisabled && styles.disabled,
              listItemWithLinkClasses.entityStyles,
              listItemWithLinkClasses.groupStyles,
              listItemWithLinkClasses.ownStyles,
            )}
          >
            <a
              className={cn(
                linkClasses.entityStyles,
                linkClasses.groupStyles,
                linkClasses.ownStyles,
              )}
              href={link}
              target="_blank"
              rel="noreferrer"
            >
              {textContent}
            </a>
          </li>
        ) : (
          <li
            ref={ref}
            id={id}
            data-ls-id={id}
            tabIndex={isDisabled ? 0 : -1}
            className={cn(
              className,
              sharedClasses.lsItem,
              sharedClasses.unsortable,
              styles.addedElem,
              isDisabled && styles.disabled,
              listItemClasses.entityStyles,
              listItemClasses.groupStyles,
              listItemClasses.ownStyles,
            )}
            {...(isDisabled && { onClick: handleListItemClick })}
          >
            {textContent}
          </li>
        )}
      </>
    );
  },
);

export default ListItem;
