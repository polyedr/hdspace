import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';

import { SharedRendererProps, HeadingRendererProps } from '../types';
const styles = require('../styles.scss');

type Props = SharedRendererProps & HeadingRendererProps;

const Heading = (props: Props) => {
  const { id, style, params, active, sortableId, isDisabled } = props;
  const { headingType, textContent } = params;
  const HeadingTag = headingType || 'h3';

  return (
    <HeadingTag
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(sharedClasses.lsItem, styles.addedElem, active && sharedClasses.activated)}
      style={{ ...style, wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {textContent}
    </HeadingTag>
  );
};

export { Heading };
