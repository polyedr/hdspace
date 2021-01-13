// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { HeadingRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('heading', {
  heading: {
    wordBreak: 'break-word',
    outline: 0,
  },
});

const Heading: React.FC<HeadingRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, className, contentEditable } = props;
    const { headingType, textContent, groupClass } = params;
    const HeadingTag = headingType || 'h3';

    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <HeadingTag
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(className, styles.heading, styles.ownStyles, groupClass)}
        {...eventHandlers}
        contentEditable={contentEditable}
        dangerouslySetInnerHTML={{ __html: textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default Heading;
