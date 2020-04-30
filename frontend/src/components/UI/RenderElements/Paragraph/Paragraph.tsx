import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';

import { SharedRendererProps, ParagraphRendererProps } from '../types';
const styles = require('../styles.scss');

type Props = SharedRendererProps & ParagraphRendererProps;

const Paragraph = (props: Props) => {
  const { id, style, params, active, sortableId, isDisabled } = props;

  return (
    <p
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      className={cn(sharedClasses.lsItem, styles.addedElem, active && sharedClasses.activated)}
      style={{ ...style, wordBreak: 'break-word' }}
      tabIndex={isDisabled ? 0 : -1}
    >
      {params.textContent}
    </p>
  );
};

export { Paragraph };
