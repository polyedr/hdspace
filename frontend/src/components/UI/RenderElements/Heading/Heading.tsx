// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { HeadingRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles({
  heading: {
    wordBreak: 'break-word',
  },
});

const Heading: React.FC<HeadingRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, className } = props;
    const { headingType, textContent } = params;
    const HeadingTag = headingType || 'h3';

    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <HeadingTag
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          styles.heading,
          styles.addedElem,
          styles.entityStyles,
          styles.groupStyles,
          styles.ownStyles,
        )}
        {...eventHandlers}
      >
        {textContent}
      </HeadingTag>
    );
  },
);

export default Heading;
