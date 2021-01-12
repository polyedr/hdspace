// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { LabelRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  label: ({ isDisabled }) => ({
    wordBreak: 'break-word',
    cursor: isDisabled ? 'default' : 'pointer',
    outline: 0,
  }),
});

const Label: React.FC<LabelRendererProps> = React.forwardRef((props, ref) => {
  const {
    id,
    params,
    className,
    contentEditable,
    entityClass,
    groupClass,
  } = props;
  const { labelFor, textContent } = params;

  const styles = useStyles(props);
  const eventHandlers = useEventHandlers(props);

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
        entityClass,
        groupClass,
        styles.addedElem,
        styles.ownStyles,
      )}
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: textContent }}
      data-gramm_editor={false}
      {...eventHandlers}
    />
  );
});

export default Label;
