import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import InlineEditable from '@Components/UI/InlineEditable';
import { useElement } from '@Src/hooks';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('pagination', {
  active: {
    backgroundColor: '#ddd',
  },
});

const OtherPaginationItem = React.forwardRef<HTMLElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [groupClass] = element.styles.classNames;
    const { textContent, link, isActiveLink, isLink, screenLink, screenName } =
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

    const { updateTextContent } = useElement(element.id);

    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

    return (
      <>
        {isLink && (isProtoMode || exportScreenFlag) ? (
          <a
            href={link}
            target={exportScreenFlag ? '_self' : '_blank'}
            rel="noreferrer"
            ref={ref as LegacyRef<HTMLAnchorElement>}
            data-ls-id={element.id}
            {...eventHandlers}
            className={cn(
              classes.ownStyles,
              groupClass,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
              isActiveLink && classes.active,
            )}
            data-gramm_editor={false}
          >
            <InlineEditable
              elementId={element.id}
              onUpdated={updateTextContent}
              text={textContent}
              renderElement={(textContent, props) => (
                <span
                  id={element.id}
                  dangerouslySetInnerHTML={{ __html: textContent }}
                  {...props}
                />
              )}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <a
            rel="noreferrer"
            ref={ref as LegacyRef<HTMLAnchorElement>}
            onClick={() =>
              isProtoMode && !exportScreenFlag ? changeScreen() : ''
            }
            data-ls-id={element.id}
            {...eventHandlers}
            data-gramm_editor={false}
            className={cn(
              classes.ownStyles,
              groupClass,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
              isActiveLink && classes.active,
            )}
          >
            <InlineEditable
              elementId={element.id}
              onUpdated={updateTextContent}
              text={textContent}
              renderElement={(textContent, props) => (
                <span
                  id={element.id}
                  dangerouslySetInnerHTML={{ __html: textContent }}
                  {...props}
                />
              )}
            />
          </a>
        ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
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
            rel="noreferrer"
            ref={ref as LegacyRef<HTMLAnchorElement>}
            data-ls-id={element.id}
            {...eventHandlers}
            data-gramm_editor={false}
            className={cn(
              classes.ownStyles,
              groupClass,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
              isActiveLink && classes.active,
            )}
          >
            <InlineEditable
              elementId={element.id}
              onUpdated={updateTextContent}
              text={textContent}
              renderElement={(textContent, props) => (
                <span
                  id={element.id}
                  dangerouslySetInnerHTML={{ __html: textContent }}
                  {...props}
                />
              )}
            />
          </a>
        ) : (
          <a
            rel="noreferrer"
            ref={ref as LegacyRef<HTMLAnchorElement>}
            data-ls-id={element.id}
            {...eventHandlers}
            className={cn(
              classes.ownStyles,
              groupClass,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
              isActiveLink && classes.active,
            )}
            data-gramm_editor={false}
          >
            <InlineEditable
              elementId={element.id}
              onUpdated={updateTextContent}
              text={textContent}
              renderElement={(textContent, props) => (
                <span
                  id={element.id}
                  dangerouslySetInnerHTML={{ __html: textContent }}
                  {...props}
                />
              )}
            />
          </a>
        )}
      </>
    );
  },
);

export default OtherPaginationItem;
