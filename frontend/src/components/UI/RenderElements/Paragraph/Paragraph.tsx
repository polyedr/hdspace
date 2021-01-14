// @ts-nocheck

import React from 'react';
import cn from 'classnames';
import { makeComponentStyles } from '../styles';
import { ParagraphRendererProps } from '../types';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('paragraph');

const Paragraph: React.FC<ParagraphRendererProps> = React.forwardRef(
  (props, ref) => {
    const { id, params, className, contentEditable, groupClass } = props;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <p
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(className, groupClass, classes.ownStyles)}
        contentEditable={contentEditable}
        {...eventHandlers}
        dangerouslySetInnerHTML={{ __html: params.textContent }}
        data-gramm_editor={false}
      />
    );
  },
);

export default Paragraph;
