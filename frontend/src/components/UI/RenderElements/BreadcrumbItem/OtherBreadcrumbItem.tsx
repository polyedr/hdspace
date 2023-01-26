import React, { LegacyRef } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('breadcrumb', {
  li: {
    display: 'inline',
    '& + li:before': {
      padding: '8px',
      color: 'black',
      content: '"/"',
    },
    '& a': {
      color: 'green',
    },
  },
  link: {
    color: 'green',
  },
});

const OtherBreadcrumbItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isLink, screenLink, screenName } =
      element.parameters;
    const classes = useStyles(props);

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
            className={cn(classes.li, classes.ownStyles, groupClass)}
            {...eventHandlers}
          >
            <a
              href={link}
              aria-label={`Link-${element.id}`}
              target={exportScreenFlag ? '_self' : '_blank'}
              style={{ textDecoration: 'none' }}
              rel="noreferrer"
            >
              {textContent}
            </a>
          </li>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              classes.li,
              classes.ownStyles,
              groupClass,
              classes.link,
            )}
            {...eventHandlers}
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
              {...eventHandlers}
            >
              {textContent}
            </a>
          </li>
        ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(classes.li, classes.ownStyles, groupClass)}
            {...eventHandlers}
          >
            <a
              aria-label={`Link-${element.id}`}
              target="_self"
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
              rel="noreferrer"
            >
              {textContent}
            </a>
          </li>
        ) : (
          <li
            ref={ref as LegacyRef<HTMLLIElement>}
            id={element.id}
            data-ls-id={element.id}
            className={cn(classes.li, classes.ownStyles, groupClass)}
            {...eventHandlers}
          >
            {textContent}
          </li>
        )}
      </>
    );
  },
);

export default OtherBreadcrumbItem;
