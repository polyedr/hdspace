import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';

import { ListItemRendererProps } from '../types';
const styles = require('../styles.scss');

const ListItem = (props: ListItemRendererProps) => {
  const { id, style, params, active, isDisabled } = props;
  const { textContent, isLink, link } = params;

  const handleListItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
    (event.target as HTMLElement).focus();
  };

  const {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    borderWidth,
    borderColor,
    borderStyle,
    backgroundColor,
    ...restStyles
  } = style;

  return (
    <>
      {isLink ? (
        <li
          id={id}
          data-ls-id={id}
          tabIndex={isDisabled ? 0 : -1}
          className={cn(
            sharedClasses.lsItem,
            sharedClasses.unsortable,
            styles.addedElem,
            isDisabled && styles.disabled,
            active && sharedClasses.activated,
          )}
          style={{
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            borderWidth,
            borderColor,
            borderStyle,
            backgroundColor,
            ...restStyles,
          }}
        >
          <a
            href={link}
            style={{
              paddingTop,
              paddingRight,
              paddingBottom,
              paddingLeft,
              ...restStyles,
              width: '100%',
              height: '100%',
              display: 'inline-block',
            }}
            target="_blank"
          >
            {textContent}
          </a>
        </li>
      ) : (
        <li
          id={id}
          data-ls-id={id}
          tabIndex={isDisabled ? 0 : -1}
          className={cn(
            sharedClasses.lsItem,
            sharedClasses.unsortable,
            styles.addedElem,
            isDisabled && styles.disabled,
            active && sharedClasses.activated,
          )}
          {...isDisabled && { onClick: handleListItemClick }}
          style={style}
        >
          {textContent}
        </li>
      )}
    </>
  );
};

export { ListItem };
