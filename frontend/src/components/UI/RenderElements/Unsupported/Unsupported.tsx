// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { SharedRendererProps } from '../types';
import Undefined from '../Undefined/Undefined';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('unknown');

const Unknown: React.FC<SharedRendererProps> = React.forwardRef(
  (props, ref) => {
    const { params, children } = props;
    const { tag, attributes, groupClass, textContent } = params;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    try {
      return React.createElement(
        tag,
        {
          ...eventHandlers,
          ...attributes,
          ref,
          className: cn(groupClass, classes.ownStyles),
        },
        textContent || children,
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Undefined tag: ${tag}`);
    }
    return <Undefined ref={ref} {...props} {...attributes} />;
  },
);

export default Unknown;
