import React from 'react';
import cn from 'classnames';

import { convertPropCSS } from '$utils/StyleHelper';
import { sharedClasses } from '$styles/sharedClasses';

import { ListRendererProps } from '../types';
import { ListItem } from '../ListItem/ListItem';
const styles = require('../styles.scss');

const List = (props: ListRendererProps) => {
  const { id, style, params, activeItemId, active, sortableId, isDisabled, childrenElements } = props;
  const { isOrdered } = params;

  const ListTag = isOrdered ? 'ol' : 'ul';

  const itemStyles = childrenElements.find(child => child.struct_type === 'listItem')?.styles || {};

  return (
    <ListTag
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(
        sharedClasses.lsItem,
        styles.addedElem,
        active && sharedClasses.activated
      )}
      style={{ ...style, ...(isOrdered && { "list-style-type": "decimal" }) }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {childrenElements.map(
        ({ id: listItemID, parameters }) => (
          <ListItem
            key={listItemID}
            id={`${listItemID}e`}
            style={convertPropCSS(itemStyles)}
            params={parameters}
            active={isDisabled && parseInt(activeItemId) === listItemID}
            isDisabled={isDisabled}
          />
        )
      )}
    </ListTag>
  );
};

export { List };
