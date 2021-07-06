import React from 'react';
import { useHistory } from 'react-router';
import cn from 'classnames';
import prevent from '@Utils/preventEvent';
import { ElementClickEvent, EventType } from '@Src/types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('link', {
  disabledLink: {
    cursor: 'default',
    transition: 'none',
    textDecoration: 'none',
  },
});

const Link = React.forwardRef<HTMLAnchorElement, RendererProps>(
  (props, ref) => {
    const classes = useStyles(props);
    const { element, isDisabled } = props;
    const { textContent, events } = element.parameters;
    const [className, groupClass] = element.styles.classNames;

    const history = useHistory();

    // return first event of type 'Click'
    const clickEvent: ElementClickEvent | undefined = events?.find(
      (event) => event.type === EventType.Click,
    );

    const eventHandlers = useEventHandlers(props, {
      onClick: (event: React.SyntheticEvent<HTMLElement>) => {
        if (isDisabled || !clickEvent) {
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
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabledLink : classes.ownPseudoStyles,
        )}
        href={
          clickEvent?.data.linkType === 'external' ? clickEvent.data.url : ''
        }
        rel="noreferrer"
        target={clickEvent?.data.linkType === 'external' ? '_blank' : '_parent'}
        draggable={false}
        dangerouslySetInnerHTML={{ __html: textContent }}
        {...eventHandlers}
      />
    );
  },
);

export default Link;
