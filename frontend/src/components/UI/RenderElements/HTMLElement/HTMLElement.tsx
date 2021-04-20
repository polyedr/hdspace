// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import Undefined from '../Undefined/Undefined';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('html');

const HTMLElement: React.FC<RendererProps> = React.forwardRef((props, ref) => {
  const { element, children } = props;
  const { tag, attributes, groupClass, textContent } = element.parameters;
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
});

export default HTMLElement;
