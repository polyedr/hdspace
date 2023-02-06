import React, { LegacyRef } from 'react';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('carousel-item', {});

const BootstrapCarouselItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, alt } = element.parameters;
    const classes = useStyles(props);
    const contentEditableSettings = useContentEditable(element.id, textContent);
    const eventHandlers = useEventHandlers<HTMLElement>(props, {
      onClick: (event: React.SyntheticEvent<HTMLElement>) => {
        if (isDisabled) {
          (event.target as HTMLElement).focus();
        }
      },
    });
    return (
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        id={element.id}
        data-ls-id={element.id}
        className={cn('carousel-item active', classes.ownStyles, groupClass)}
        data-gramm_editor={false}
        {...contentEditableSettings.props}
        {...contentEditableSettings.events}
        {...eventHandlers}
      >
        <img src={link} className="d-block w-100" alt={alt} />
      </div>
    );
  },
);

export default BootstrapCarouselItem;
