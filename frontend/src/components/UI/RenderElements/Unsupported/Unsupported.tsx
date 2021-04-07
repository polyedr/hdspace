// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { SharedRendererProps } from '../types';
import Undefined from '../Undefined/Undefined';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('unknown');

const Unknown: React.FC<SharedRendererProps> = React.forwardRef(
  (props, ref) => {
    const { tag, attributes, groupClass } = props;
    const classes = useStyles();

    try {
      return React.createElement(tag, {
        ...attributes,
        ...props,
        ref,
        className: cn(groupClass, classes.ownStyles),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Undefined tag: ${tag}`);
    }
    return <Undefined ref={ref} {...props} {...attributes} />;
  },
);

export default Unknown;
