import React, { LegacyRef } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const BootstrapNavbar = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const {
      parameters: { titleName, titleLink, isLink, screenLink, screenName },
    } = element;
    const [groupClass] = element.styles.classNames;

    const useStyles = makeComponentStyles('navbar', {});
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);

    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

    return (
      <nav
        ref={ref as LegacyRef<HTMLAnchorElement>}
        className={cn(
          'navbar-expand-sm navbar-light bg-light',
          classes.ownStyles,
          groupClass,
          !isDisabled && classes.ownPseudoStyles,
        )}
        aria-label="navbar"
        id={element.id}
        data-ls-id={element.id}
        {...eventHandlers}
      >
        <div className="container-fluid">
          {isLink && (isProtoMode || exportScreenFlag) ? (
            <a
              rel="noreferrer"
              href={titleLink}
              style={{ cursor: 'pointer' }}
              className="navbar-brand"
              ref={ref as LegacyRef<HTMLAnchorElement>}
              {...eventHandlers}
              target={exportScreenFlag ? '_self' : '_blank'}
              dangerouslySetInnerHTML={{ __html: titleName }}
            />
          ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
            <a
              rel="noreferrer"
              ref={ref as LegacyRef<HTMLAnchorElement>}
              id={element.id}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                isProtoMode && !exportScreenFlag ? changeScreen() : ''
              }
              className="navbar-brand"
              data-ls-id={element.id}
              {...eventHandlers}
              data-gramm_editor={false}
              dangerouslySetInnerHTML={{ __html: titleName }}
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
              style={{ cursor: 'pointer' }}
              rel="noreferrer"
              className="navbar-brand"
              ref={ref as LegacyRef<HTMLAnchorElement>}
              dangerouslySetInnerHTML={{ __html: titleName }}
              {...eventHandlers}
            />
          ) : (
            <a
              rel="noreferrer"
              ref={ref as LegacyRef<HTMLAnchorElement>}
              id={element.id}
              style={{ cursor: 'pointer' }}
              className="navbar-brand"
              data-ls-id={element.id}
              {...eventHandlers}
              data-gramm_editor={false}
              dangerouslySetInnerHTML={{ __html: titleName }}
            />
          )}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">{children}</div>
          </div>
        </div>
      </nav>
    );
  },
);

export default BootstrapNavbar;
