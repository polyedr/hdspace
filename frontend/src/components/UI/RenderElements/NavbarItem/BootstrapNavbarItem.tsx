import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('breadcrumb', {
  urlClick: {
    cursor: 'pointer',
    textDecoration: 'none',
  },
});

const BootstrapNavbarItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element } = props;
    const [groupClass] = element.styles.classNames;
    const { itemName, link, isLink, screenLink, screenName } =
      element.parameters;
    const classes = useStyles(props);

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
          <a
            href={link}
            rel="noreferrer"
            className={cn(
              'nav-link',
              classes.ownStyles,
              classes.urlClick,
              groupClass,
            )}
            target={exportScreenFlag ? '_self' : '_blank'}
            dangerouslySetInnerHTML={{ __html: itemName }}
            aria-label={`Link-${element.id}`}
            {...eventHandlers}
          />
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <a
            id={element.id}
            onClick={() =>
              isProtoMode && !exportScreenFlag ? changeScreen() : ''
            }
            {...eventHandlers}
            aria-label={`Link-${element.id}`}
            data-ls-id={element.id}
            className={cn(
              'nav-link',
              classes.ownStyles,
              classes.urlClick,
              groupClass,
            )}
            data-gramm_editor={false}
            dangerouslySetInnerHTML={{ __html: itemName }}
          />
        ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
          <a
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
            {...eventHandlers}
            aria-label={`Link-${element.id}`}
            className={cn(
              'nav-link',
              classes.ownStyles,
              classes.urlClick,
              groupClass,
            )}
            rel="noreferrer"
            ref={ref as LegacyRef<HTMLAnchorElement>}
            dangerouslySetInnerHTML={{ __html: itemName }}
          />
        ) : (
          <a
            aria-label={`Link-${element.id}`}
            rel="noreferrer"
            ref={ref as LegacyRef<HTMLAnchorElement>}
            id={element.id}
            {...eventHandlers}
            className={cn(
              'nav-link',
              classes.ownStyles,
              classes.urlClick,
              groupClass,
            )}
            data-ls-id={element.id}
            data-gramm_editor={false}
            dangerouslySetInnerHTML={{ __html: itemName }}
          />
        )}
      </>
    );
  },
);

export default BootstrapNavbarItem;
