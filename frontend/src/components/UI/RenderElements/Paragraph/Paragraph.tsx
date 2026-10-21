import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from '@/compat/router';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('paragraph', {
  url: {
    textDecoration: 'none',
  },
});

const Paragraph = React.forwardRef<HTMLParagraphElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { textContent, isLink, link, screenLink, screenName } =
      element.parameters;
    const classes = useStyles(props);
    const contentEditableSettings = useContentEditable(element.id, textContent);
    const eventHandlers = useEventHandlers(
      props,
      contentEditableSettings.events,
    );
    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);

    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

    return (
      <>
        {isLink && (isProtoMode || exportScreenFlag) ? (
          <a
            aria-label={`Link-${element.id}`}
            target={exportScreenFlag ? '_self' : '_blank'}
            href={link}
            rel="noreferrer"
            className={cn(classes.url)}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <div
              ref={ref}
              id={element.id}
              data-ls-id={element.id}
              className={cn(
                className,
                groupClass,
                classes.ownStyles,
                !isDisabled && classes.ownPseudoStyles,
              )}
              key={element.id}
              dangerouslySetInnerHTML={{ __html: textContent }}
              data-gramm_editor={false}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <div
            ref={ref}
            id={element.id}
            role="presentation"
            data-ls-id={element.id}
            onClick={() =>
              isProtoMode && !exportScreenFlag ? changeScreen() : ''
            }
            key={element.id}
            className={cn(
              className,
              groupClass,
              classes.ownStyles,
              !isDisabled && classes.ownPseudoStyles,
            )}
            data-gramm_editor={false}
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...contentEditableSettings.props}
            {...eventHandlers}
          />
        ) : screenLink && screenName && (isProtoMode || exportScreenFlag) ? (
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
            className={cn(classes.url)}
            rel="noreferrer"
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <div
              ref={ref}
              id={element.id}
              data-ls-id={element.id}
              key={element.id}
              className={cn(
                className,
                classes.url,
                groupClass,
                classes.ownStyles,
                !isDisabled && classes.ownPseudoStyles,
              )}
              dangerouslySetInnerHTML={{ __html: textContent }}
              data-gramm_editor={false}
            />
          </a>
        ) : (
          <div
            ref={ref}
            id={element.id}
            data-ls-id={element.id}
            key={element.id}
            className={cn(
              className,
              groupClass,
              classes.ownStyles,
              !isDisabled && classes.ownPseudoStyles,
            )}
            dangerouslySetInnerHTML={{ __html: textContent }}
            data-gramm_editor={false}
            {...contentEditableSettings.props}
            {...eventHandlers}
          />
        )}
      </>
    );
  },
);

export default Paragraph;
