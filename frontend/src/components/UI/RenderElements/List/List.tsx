import React from 'react';
import cn from 'classnames';

import { Renderer } from '../types';
import { convertPropCSS } from '$utils/StyleHelper';
const styles = require('../styles.scss');

const List: Renderer = (props) => {
  const { id, style, params, active, sortableId, isDisabled, childrenElements } = props;
  const { listItems, makeLink, isOrdered } = params;

  const ListTag = isOrdered ? 'ol' : 'ul';

  const itemStyles = childrenElements.find(child => child.struct_type === 'listItem')?.styles;

  return (
    <ListTag
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn('ls-item', styles.addedElem, active && 'activated')}
      style={{ ...style, ...(isOrdered && { 'list-style-type': 'decimal' }) }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {listItems?.map(({ textContent, link }) => (
          <>{makeLink ? 
            <a href={link} style={itemStyles && convertPropCSS(itemStyles)}>{textContent}</a> :
            <li style={itemStyles && convertPropCSS(itemStyles)}>{textContent}</li>
          }</>
        ))
      }
    </ListTag>
  );
};

export { List };
