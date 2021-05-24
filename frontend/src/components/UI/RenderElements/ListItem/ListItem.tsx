// @ts-ignore
import React, { LegacyRef } from 'react';
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

const ListItem = React.forwardRef<HTMLElement, RendererProps>((props, ref) => {
  const { element, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;
  const { textContent, isLink, link } = element.parameters;

  const listItemClasses = useItemStyles(props);
  const listItemWithLinkClasses = useEditableItemStyles(props);
  const linkClasses = useLinkStyles(props);
  const contentEditableSettings = useContentEditable(element.id, textContent);
  const eventHandlers = useEventHandlers<HTMLElement>(props, {
    onClick: (event: React.SyntheticEvent<HTMLElement>) => {
      if (isDisabled) {
        (event.target as HTMLElement).focus();
      }
    },
  });

  return (
    <>
      {isLink ? (
        <li
          ref={ref as LegacyRef<HTMLLIElement>}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            className,
            isDisabled
              ? listItemClasses.disabled
              : listItemClasses.ownPseudoStyles,
            groupClass,
            listItemWithLinkClasses.ownStyles,
          )}
          {...eventHandlers}
        >
          <a
            className={cn(linkClasses.link, groupClass, linkClasses.ownStyles)}
            aria-label={`Link-${element.id}`}
            href={link}
            target="_blank"
            rel="noreferrer"
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          />
        </li>
      ) : (
        <li
          ref={ref as LegacyRef<HTMLLIElement>}
          id={element.id}
          data-ls-id={element.id}
          className={cn(
            className,
            isDisabled
              ? listItemClasses.disabled
              : listItemClasses.ownPseudoStyles,
            groupClass,
            listItemClasses.ownStyles,
          )}
          aria-label={`Button-${element.id}`}
          {...eventHandlers}
          dangerouslySetInnerHTML={{ __html: textContent }}
          data-gramm_editor={false}
          {...eventHandlers}
          {...contentEditableSettings.props}
          {...contentEditableSettings.events}
        />
      )}
    </>
  );
});

export default ListItem;
