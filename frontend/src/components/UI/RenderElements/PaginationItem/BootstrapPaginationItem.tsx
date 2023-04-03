import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('pagination', {
  urlClick: {
    cursor: 'pointer',
  },
});

const BootstrapPaginationItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isActiveLink, isLink, screenLink, screenName } =
      element.parameters;
    const classes = useStyles(props);

    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);

    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

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
        {isLink && (isProtoMode || exportScreenFlag) ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              'page-item',
              { active: isActiveLink },
              classes.ownStyles,
              groupClass,
            )}
            aria-current="page"
            {...eventHandlers}
            data-gramm_editor={false}
          >
            <a
              href={link}
              aria-label={`Link-${element.id}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...contentEditableSettings.props}
              {...contentEditableSettings.events}
              target={exportScreenFlag ? '_self' : '_blank'}
              rel="noreferrer"
              className="page-link"
            />
          </li>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              'page-item',
              { active: isActiveLink },
              classes.ownStyles,
              groupClass,
            )}
            aria-current="page"
            data-gramm_editor={false}
          >
            <a
              rel="noreferrer"
              ref={ref as LegacyRef<HTMLAnchorElement>}
              id={element.id}
              onClick={() =>
                isProtoMode && !exportScreenFlag ? changeScreen() : ''
              }
              className={cn('page-link', classes.urlClick)}
              data-ls-id={element.id}
              {...eventHandlers}
              data-gramm_editor={false}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          </li>
        ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              'page-item',
              { active: isActiveLink },
              classes.ownStyles,
              groupClass,
            )}
            aria-current="page"
            {...eventHandlers}
            data-gramm_editor={false}
          >
            <a
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
              aria-label={`Link-${element.id}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...contentEditableSettings.props}
              {...contentEditableSettings.events}
              rel="noreferrer"
              className="page-link"
            />
          </li>
        ) : (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              'page-item',
              { active: isActiveLink },
              classes.ownStyles,
              groupClass,
            )}
            aria-current="page"
            {...eventHandlers}
            data-gramm_editor={false}
          >
            <a
              aria-label={`Link-${element.id}`}
              rel="noreferrer"
              className={cn('page-link', classes.urlClick)}
              {...contentEditableSettings.props}
              {...contentEditableSettings.events}
              dangerouslySetInnerHTML={{ __html: textContent }}
            />
          </li>
        )}
      </>
    );
  },
);

export default BootstrapPaginationItem;
