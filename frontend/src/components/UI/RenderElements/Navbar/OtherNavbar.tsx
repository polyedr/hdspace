import React, { LegacyRef } from 'react';
import cn from 'classnames';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

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
        color: 'rgb(79 79 79)',
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
          color: 'rgb(79 79 79)',
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
      parameters: { titleName, titleLink },
    } = element;
    const [groupClass] = element.styles.classNames;

    const classes = useStyles(props);
    const eventHandlers = useEventHandlers(props);

    return (
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        id={element.id}
        data-ls-id={element.id}
        className={cn(
          classes.nav,
          classes.ownStyles,
          groupClass,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        {...eventHandlers}
      >
        <input type="checkbox" id={`nav-check-${element.id}`} />
        <div className="nav-header">
          <div className="nav-title">
            <a href={titleLink}>{titleName}</a>
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
