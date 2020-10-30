// @ts-nocheck

import React from 'react';
import cn from 'classnames';

import { HeadingRendererProps } from '../types';
import { makeComponentStyles } from '../styles';

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
      >
        {textContent}
      </HeadingTag>
    );
  },
);

export default Heading;
