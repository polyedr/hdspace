import React, { LegacyRef } from 'react';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('breadcrumb', {});

const BootstrapBreadcrumbItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isLink, screenLink, screenName } =
      element.parameters;
    const classes = useStyles(props);

    const contentEditableSettings = useContentEditable(element.id, textContent);
    const eventHandlers = useEventHandlers<HTMLElement>(props, {
      onClick: (event: React.SyntheticEvent<HTMLElement>) => {
        if (isDisabled) {
          (event.target as HTMLElement).focus();
        }
      },
    });

    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);

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
              'breadcrumb-item active',
              classes.ownStyles,
              groupClass,
            )}
            aria-current="page"
            {...eventHandlers}
            data-gramm_editor={false}
          >
            <a
              href={link}
              ref={ref as LegacyRef<HTMLAnchorElement>}
              aria-label={`Link-${element.id}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...contentEditableSettings.props}
              {...contentEditableSettings.events}
              target={exportScreenFlag ? '_self' : '_blank'}
              style={{ textDecoration: 'none' }}
              rel="noreferrer"
            />
          </li>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn('breadcrumb-item', classes.ownStyles, groupClass)}
            aria-current="page"
            data-gramm_editor={false}
          >
            <a
              onClick={() =>
                isProtoMode && !exportScreenFlag ? changeScreen() : ''
              }
              rel="noreferrer"
              ref={ref as LegacyRef<HTMLAnchorElement>}
              style={{ textDecoration: 'none' }}
              {...eventHandlers}
              aria-label={`Link-${element.id}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...contentEditableSettings.props}
              {...eventHandlers}
            />
          </li>
        ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              'breadcrumb-item active',
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
              style={{ textDecoration: 'none' }}
              aria-label={`Link-${element.id}`}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...contentEditableSettings.props}
              {...contentEditableSettings.events}
              target="_self"
              ref={ref as LegacyRef<HTMLAnchorElement>}
              rel="noreferrer"
            />
          </li>
        ) : (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn('breadcrumb-item', classes.ownStyles, groupClass)}
            aria-current="page"
            dangerouslySetInnerHTML={{ __html: textContent }}
            data-gramm_editor={false}
            {...eventHandlers}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          />
        )}
      </>
    );
  },
);

export default BootstrapBreadcrumbItem;
