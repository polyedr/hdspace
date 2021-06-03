import React, { LegacyRef } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('pagination', {
  active: {
    backgroundColor: '#ddd',
  },
});

const OtherPaginationItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isActiveLink } = element.parameters;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers<HTMLElement>(props, {
      onClick: (event: React.SyntheticEvent<HTMLElement>) => {
        if (isDisabled) {
          (event.target as HTMLElement).focus();
        }
      },
    });

    return (
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        ref={ref as LegacyRef<HTMLAnchorElement>}
        id={element.id}
        className={cn(
          classes.ownStyles,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
          isActiveLink && classes.active,
        )}
        data-ls-id={element.id}
        {...eventHandlers}
        data-gramm_editor={false}
      >
        {textContent}
      </a>
    );
  },
);

export default OtherPaginationItem;
