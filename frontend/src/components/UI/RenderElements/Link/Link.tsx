import React from 'react';
import { useHistory } from 'react-router';
import cn from 'classnames';
import prevent from '@Utils/preventEvent';
import { ElementClickEvent } from '@Src/types';
import { HyperLinkRendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../useEventHandlers';

const useStyles = makeComponentStyles('link');

const Link = React.forwardRef<HTMLAnchorElement, HyperLinkRendererProps>(
  (props, ref) => {
    const classes = useStyles(props);
    const { id, isDisabled, params, className, groupClass } = props;
    const { textContent, events } = params;

    const history = useHistory();

    // return first event of type 'click'
    const clickEvent: ElementClickEvent | undefined = events.find(
      (event) => event.type === 'click',
    );

    const eventHandlers = useEventHandlers(props, {
      onClick: (event) => {
        if (isDisabled) {
          prevent(event);
          return;
        }

        if (!clickEvent) {
          prevent(event);
          return;
        }

        if (
          clickEvent.data.linkType === 'internal' &&
          clickEvent.data.screenId
        ) {
          prevent(event);
          if (clickEvent.data.screenId !== 'noScreen') {
            history.push(clickEvent.data.screenId);
          }
        }
      },
    });

    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a
        ref={ref}
        id={id}
        data-ls-id={id}
        key={id}
        className={cn(
          className,
          groupClass,
          isDisabled && classes.disabled,
          classes.ownStyles,
        )}
        href={
          clickEvent?.data.linkType === 'external' ? clickEvent.data.url : ''
        }
        target={clickEvent?.data.linkType === 'external' ? '_blank' : '_parent'}
        {...eventHandlers}
      >
        {textContent}
      </a>
    );
  },
);

export default Link;
