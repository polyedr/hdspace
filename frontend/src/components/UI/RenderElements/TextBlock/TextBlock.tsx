import React from 'react';
import cn from 'classnames';

import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';
import useEventHandlers from '../../RenderHooks/useEventHandlers';

const useStyles = makeComponentStyles('text', {
  wordBreak: 'break-word',
});

const TextBlock = React.forwardRef<HTMLDivElement, RendererProps>(
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

    const formatText = (str: string) => {
      return str.replace(/&nbsp;|<br>/g, '');
    };

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
            style={{ textDecoration: 'none' }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <div
              ref={ref}
              id={element.id}
              data-ls-id={element.id}
              className={cn(
                className,
                classes.textBlock,
                groupClass,
                classes.ownStyles,
                isDisabled ? classes.disabled : classes.ownPseudoStyles,
              )}
              dangerouslySetInnerHTML={{ __html: formatText(textContent) }}
              data-gramm_editor={false}
              {...contentEditableSettings.props}
              {...eventHandlers}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <div
            ref={ref}
            id={element.id}
            onClick={() =>
              isProtoMode && !exportScreenFlag ? changeScreen() : ''
            }
            data-ls-id={element.id}
            className={cn(
              className,
              classes.textBlock,
              groupClass,
              classes.ownStyles,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
            )}
            dangerouslySetInnerHTML={{ __html: formatText(textContent) }}
            data-gramm_editor={false}
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
            style={{ textDecoration: 'none' }}
            rel="noreferrer"
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <div
              ref={ref}
              id={element.id}
              data-ls-id={element.id}
              className={cn(
                className,
                classes.textBlock,
                groupClass,
                classes.ownStyles,
                isDisabled ? classes.disabled : classes.ownPseudoStyles,
              )}
              dangerouslySetInnerHTML={{ __html: formatText(textContent) }}
              data-gramm_editor={false}
              {...contentEditableSettings.props}
              {...eventHandlers}
            />
          </a>
        ) : (
          <div
            ref={ref}
            id={element.id}
            data-ls-id={element.id}
            className={cn(
              className,
              classes.textBlock,
              groupClass,
              classes.ownStyles,
              isDisabled ? classes.disabled : classes.ownPseudoStyles,
            )}
            dangerouslySetInnerHTML={{ __html: formatText(textContent) }}
            data-gramm_editor={false}
            {...contentEditableSettings.props}
            {...eventHandlers}
          />
        )}
      </>
    );
  },
);

export default TextBlock;
