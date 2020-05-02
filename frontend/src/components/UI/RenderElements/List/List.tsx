import React from 'react';
import cn from 'classnames';

import { convertPropCSS } from '$utils/StyleHelper';
import { sharedClasses } from '$styles/sharedClasses';

import { ListRendererProps } from '../types';
const styles = require('../styles.scss');

const List = (props: ListRendererProps) => {
  const { id, style, params, active, sortableId, isDisabled, childrenElements } = props;
  const { isOrdered } = params;

  const ListTag = isOrdered ? 'ol' : 'ul';

  const itemStyles = childrenElements.find(child => child.struct_type === 'listItem')?.styles || {};

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
  } = convertPropCSS(itemStyles);

  return (
    <ListTag
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        sharedClasses.lsItem,
        styles.addedElem,
        isDisabled && styles.disabled,
        active && sharedClasses.activated
      )}
      style={{ ...style, ...(isOrdered && { "list-style-type": "decimal" }) }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {childrenElements.map(({ id: itemID, parameters: { textContent, isLink, link } }) => (
        <div key={itemID}>
          {isLink ? (
            <li
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
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                }}
                target="_blank"
              >
                {textContent}
              </a>
            </li>
          ) : (
            <li style={itemStyles && convertPropCSS(itemStyles)}>
              {textContent}
            </li>
          )}
        </div>
      ))}
    </ListTag>
  );
};

export { List };
