import React from 'react';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { omit } from 'ramda';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const omitEditableStyles = [
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
];
const omitLinkStyles = [
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'backgroundColor',
];

const useItemStyles = makeComponentStyles('list-item');

const useEditableItemStyles = makeStyles({
  ownStyles: ({ element }: RendererProps) =>
    omit(omitEditableStyles, element.styles.ownStyles),
});

const useLinkStyles = makeStyles({
  ownStyles: ({ element }: RendererProps) =>
    omit(omitLinkStyles, element.styles.ownStyles),
  link: {
    width: '100%',
    height: '100%',
    display: 'inline-block',
    outline: 0,
  },
});

const ListItem = React.forwardRef<HTMLLinkElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { textContent, isLink, link } = element.parameters;

    const listItemClasses = useItemStyles(props);
    const listItemWithLinkClasses = useEditableItemStyles(props);
    const linkClasses = useLinkStyles(props);
    const [contentEditable, handleResetState] = useContentEditable(element.id);
    const eventHandlers = useEventHandlers(props, {
      onBlur: handleResetState,
    });

    const clickHandler = eventHandlers.onClick;
    eventHandlers.onClick = (event: React.MouseEvent<HTMLLIElement>) => {
      if (isDisabled) {
        (event.target as HTMLElement).focus();
      }
      if (clickHandler) {
        clickHandler(event);
      }
    };

    return (
      <>
        {isLink ? (
          <li
            ref={ref}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              className,
              isDisabled && listItemClasses.disabled,
              groupClass,
              listItemWithLinkClasses.ownStyles,
            )}
            {...eventHandlers}
          >
            <a
              className={cn(
                linkClasses.link,
                groupClass,
                linkClasses.ownStyles,
              )}
              aria-label={`Link-${element.id}`}
              href={link}
              target="_blank"
              rel="noreferrer"
              contentEditable={contentEditable}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          </li>
        ) : (
          <li
            ref={ref}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              className,
              isDisabled && listItemClasses.disabled,
              groupClass,
              listItemClasses.ownStyles,
            )}
            aria-label={`Button-${element.id}`}
            {...eventHandlers}
            contentEditable={contentEditable}
            dangerouslySetInnerHTML={{ __html: textContent }}
            data-gramm_editor={false}
          />
        )}
      </>
    );
  },
);

export default ListItem;
