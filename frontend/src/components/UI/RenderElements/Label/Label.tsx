// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { LabelRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles({
  label: ({ isDisabled }) => ({
    wordBreak: 'break-word',
    cursor: isDisabled ? 'default' : 'pointer',
  }),
});

const Label: React.FC<LabelRendererProps> = React.forwardRef((props, ref) => {
  const { id, params, isDisabled, className } = props;
  const { labelFor, textContent } = params;

  const styles = useStyles(props);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <label
      ref={ref}
      id={id}
      data-ls-id={id}
      key={id}
      {...(labelFor !== 'no for attribute' && { htmlFor: labelFor })}
      className={cn(
        className,
        styles.label,
        styles.addedElem,
        styles.entityStyles,
        styles.groupStyles,
        styles.ownStyles,
      )}
      onClick={(event) => isDisabled && event.preventDefault()}
    >
      {textContent}
    </label>
  );
});

export default Label;
