import React from 'react';
import cn from 'classnames';

import { sharedClasses } from '$styles/sharedClasses';

import { SharedRendererProps, LabelRendererProps } from '../types';
const styles = require('../styles.scss');

type Props = SharedRendererProps & LabelRendererProps;

const Label = (props: Props) => {
  const { id, style, params, active, sortableId, isDisabled } = props;
  const { labelFor, textContent } = params;

  return (
    <label
      id={id}
      data-ls-id={id}
      data-id={sortableId}
      key={id}
      {...labelFor !== 'no for attribute' && { htmlFor: labelFor }}
      className={cn(sharedClasses.lsItem, styles.addedElem, active && sharedClasses.activated)}
      style={{ ...style, wordBreak: 'break-word', cursor: isDisabled ? 'default' : 'pointer' }}
      tabIndex={isDisabled ? 0 : -1}
      onClick={event => isDisabled && event.preventDefault()}
    >
      {textContent}
    </label>
  );
};

export { Label };
