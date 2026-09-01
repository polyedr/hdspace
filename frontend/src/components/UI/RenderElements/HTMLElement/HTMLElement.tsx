import React from 'react';
import cn from 'classnames';
import logger from 'loglevel';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import Undefined from '../Undefined/Undefined';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('html', {
  html: {
    height: '100px',
  },
});

const HTMLElement: React.FC<RendererProps> = React.forwardRef((props, ref) => {
  const { element, children, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;
  const { tag, attributes, textContent } = element.parameters;
  const classes = useStyles(props);
  const eventHandlers = useEventHandlers(props);

  try {
    return React.createElement(tag, {
      ...eventHandlers,
      ...attributes,
      ref,
      id: element?.id,
      dangerouslySetInnerHTML: { __html: textContent || children },
      className: cn(
        className,
        classes.html,
        groupClass,
        classes.ownStyles,
        !isDisabled && classes.ownPseudoStyles,
      ),
    });
  } catch (e) {
    logger.error(`Undefined tag: ${tag}`);
  }
  return <Undefined ref={ref} {...props} {...attributes} />;
});

export default HTMLElement;
