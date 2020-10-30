// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import makeComponentStyles from '../styles';

import { DivBlockRendererProps } from '../types';

const useStyles = makeComponentStyles();

const DivBlockRenderer: React.FC<DivBlockRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, isDisabled, children, className, isBorderVisible } = props;
    const classes = useStyles(props);

    return (
      <div
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          classes.addedElem,
          classes.entityStyles,
          classes.groupStyles,
          classes.ownStyles,
        )}
        style={{ ...(isBorderVisible && isDisabled && { outline: 'none' }) }}
      >
        {children}
      </div>
    );
  },
);

export default DivBlockRenderer;
