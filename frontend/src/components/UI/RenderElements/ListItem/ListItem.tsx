import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { makeStyles } from '@mui/styles';
import { omit } from 'ramda';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

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
    height: '100%',
    display: 'inline-block',
    outline: 0,
  },
  linkClick: {
    cursor: 'pointer',
  },
});

const ListItem = React.forwardRef<HTMLElement, RendererProps>((props, ref) => {
  const { element, isDisabled } = props;
  const [className, groupClass] = element.styles.classNames;
  const { textContent, isLink, link, screenLink, screenName } =
    element.parameters;

  const listItemClasses = useItemStyles(props);
  const listItemWithLinkClasses = useEditableItemStyles(props);
  const linkClasses = useLinkStyles(props);
  const contentEditableSettings = useContentEditable(element.id, textContent);

  const history = useHistory();
  const isProtoMode = useSelector(selectIsPrototypeMode);
  const exportScreenFlag = useSelector(selectExportScreenFlag);
  const eventHandlers = useEventHandlers(props);
  const changeScreen = () => {
    history.push(`/project/${screenLink}`);
  };

  return (
    <>
      {isLink && (isProtoMode || exportScreenFlag) ? (
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
            className={cn(
              linkClasses.link,
              linkClasses.linkClick,
              groupClass,
              linkClasses.ownStyles,
            )}
            aria-label={`Link-${element.id}`}
            style={{ textDecoration: 'none' }}
            href={link}
            target={exportScreenFlag ? '_self' : '_blank'}
            rel="noreferrer"
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          />
        </li>
      ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
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
          data-gramm_editor={false}
        >
          <a
            aria-label={`Link-${element.id}`}
            rel="noreferrer"
            onClick={() =>
              isProtoMode && !exportScreenFlag ? changeScreen() : ''
            }
            ref={ref as LegacyRef<HTMLAnchorElement>}
            id={element.id}
            {...eventHandlers}
            className={cn(
              linkClasses.link,
              linkClasses.linkClick,
              groupClass,
              linkClasses.ownStyles,
            )}
            data-ls-id={element.id}
            data-gramm_editor={false}
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...contentEditableSettings.props}
          />
        </li>
      ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
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
          data-gramm_editor={false}
        >
          <a
            className={cn(
              linkClasses.link,
              linkClasses.linkClick,
              groupClass,
              linkClasses.ownStyles,
            )}
            aria-label={`Link-${element.id}`}
            style={{ textDecoration: 'none' }}
            href={
              isProtoMode
                ? exportScreenFlag
                  ? `../${screenName}/index.html`
                  : '#'
                : exportScreenFlag
                ? `../${screenName}/index.html`
                : ''
            }
            target="_self"
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
            listItemWithLinkClasses.ownStyles,
          )}
          {...eventHandlers}
          data-gramm_editor={false}
        >
          <a
            aria-label={`Link-${element.id}`}
            className={cn(linkClasses.link, groupClass, linkClasses.ownStyles)}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
            dangerouslySetInnerHTML={{ __html: textContent }}
          />
        </li>
      )}
    </>
  );
});

export default ListItem;
