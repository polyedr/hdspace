import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from '@/compat/router';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('navbar', {
  nav: (props: RendererProps) => ({
    width: '100%',
    position: 'relative',
    '@media (min-width:600px)': {
      '&> .nav-btn': {
        display: 'none',
      },
    },
    '&> .nav-links': {
      display: 'inline',
      float: 'right',
      fontSize: '18px',
      '&> a': {
        display: 'inline-block',
        padding: '13px 10px 13px 10px',
        textDecoration: 'none',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      },
    },
    '&> .nav-header': {
      display: 'inline',
      '&> .nav-title': {
        display: 'inline-block',
        fontSize: '22px',
        padding: '10px 10px 10px 10px',
        '&> a': {
          textDecoration: 'none',
        },
      },
    },
    [`&> #nav-check-${props.element.id}`]: {
      display: 'none',
    },
  }),
  '@media (max-width:600px)': {
    nav: (props: RendererProps) => ({
      '&> .nav-btn': {
        position: 'absolute',
        display: 'block',
        right: '0px',
        top: '0px',
        '&> label': {
          display: 'inline-block',
          width: '50px',
          height: '50px',
          padding: '13px',
          [`&:hover,.nav #nav-check-${props.element.id}:checked~ .nav-btn> label`]:
            {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          '&> span': {
            display: 'block',
            width: '25px',
            height: '10px',
            borderTop: '2px solid rgb(79 79 79)',
          },
        },
      },
      '&> .nav-links': {
        display: 'block',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        height: '0px',
        transition: 'all 0.3s ease-in',
        overflowY: 'hidden',
        top: '50px',
        left: '0px',
        '&> a': {
          display: 'block',
          width: '100%',
        },
      },
      [`&> #nav-check-${props.element.id}:not(:checked)~ .nav-links`]: {
        height: '0px',
      },
      [`&> #nav-check-${props.element.id}:checked~ .nav-links`]: {
        height: 'calc(100vh - 50px)',
      },
    }),
  },
});

const OtherNavbar = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { children, element, isDisabled } = props;
    const {
      parameters: { titleName, titleLink, isLink, screenLink, screenName },
    } = element;
    const [className, groupClass] = element.styles.classNames;
    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);

    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

    return (
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          classes.nav,
          classes.ownStyles,
          groupClass,
          className,
          !isDisabled && classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        <input type="checkbox" id={`nav-check-${element.id}`} />
        <div className="nav-header">
          <div className="nav-title">
            {isLink && (isProtoMode || exportScreenFlag) ? (
              <a
                rel="noreferrer"
                href={titleLink}
                style={{ cursor: 'pointer' }}
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
                data-ls-id={element.id}
                {...eventHandlers}
                data-gramm_editor={false}
                dangerouslySetInnerHTML={{ __html: titleName }}
              />
            ) : screenLink &&
              screenName &&
              (isProtoMode || exportScreenFlag) ? (
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
                data-ls-id={element.id}
                {...eventHandlers}
                data-gramm_editor={false}
                dangerouslySetInnerHTML={{ __html: titleName }}
              />
            )}
          </div>
        </div>
        <div className="nav-btn">
          <label htmlFor={`nav-check-${element.id}`}>
            <span />
            <span />
            <span />
          </label>
        </div>

        <div className="nav-links">{children}</div>
      </div>
    );
  },
);
export default OtherNavbar;
