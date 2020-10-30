// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { HeadingRendererProps } from '../types';
import makeComponentStyles from '../styles';

// const styles = require('../styles.scss');
const useStyles = makeComponentStyles();
const useDefaultStyles = makeStyles({
  heading: {
    wordBreak: 'break-word',
  },
});

const Heading: React.FC<HeadingRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, className } = props;
    const styles = useStyles(props);
    const defaultStyles = useDefaultStyles();

    const { headingType, textContent } = params;
    const HeadingTag = headingType || 'h3';

    return (
      <HeadingTag
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          defaultStyles.heading,
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
