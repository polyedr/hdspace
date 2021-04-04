// @ts-nocheck

import React, { useRef } from 'react';
import cn from 'classnames';
import { HeadingRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('heading');

const Heading: React.FC<HeadingRendererProps> = React.forwardRef(
  (props, ref) => {
    const domRef = useRef<HTMLElement>(null);
    const { id, params, className, contentEditable } = props;
    const { headingType, textContent, groupClass } = params;
    const HeadingTag = headingType || 'h3';

    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <HeadingTag
        ref={(dom: HTMLElement) => {
          domRef.current = dom;
          if (ref instanceof Function) {
            ref(dom);
          } else {
            ref.current = dom;
          }
        }}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(className, styles.ownStyles, groupClass)}
        {...eventHandlers}
        contentEditable={contentEditable}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default Heading;
