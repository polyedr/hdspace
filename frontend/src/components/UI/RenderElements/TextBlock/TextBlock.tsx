import React from 'react';
import cn from 'classnames';

import { useSelector } from 'react-redux';
import { useHistory } from '@/compat/router';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import InlineEditable from '@Components/UI/InlineEditable';
import { useElement } from '@Src/hooks';
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

    const formatText = (str: string) => str.replace(/&nbsp;|<br>/g, '');

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
            aria-label={`Link-${element.id}`}
            target={exportScreenFlag ? '_self' : '_blank'}
            href={link}
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <InlineEditable
              richTextEditor
              text={formatText(textContent)}
              onUpdated={updateTextContent}
              elementId={element.id}
              renderElement={(text, props) => (
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
                  dangerouslySetInnerHTML={{ __html: text }}
                  data-gramm_editor={false}
                  {...contentEditableSettings.props}
                  {...eventHandlers}
                  {...props}
                />
              )}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <InlineEditable
            richTextEditor
            text={formatText(textContent)}
            onUpdated={updateTextContent}
            elementId={element.id}
            renderElement={(textContent, props) => (
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
                {...props}
              />
            )}
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
            <InlineEditable
              richTextEditor
              text={formatText(textContent)}
              onUpdated={updateTextContent}
              elementId={element.id}
              renderElement={(textContent, props) => (
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
                  {...props}
                />
              )}
            />
          </a>
        ) : (
          <InlineEditable
            richTextEditor
            text={formatText(textContent)}
            onUpdated={updateTextContent}
            elementId={element.id}
            renderElement={(textContent, props) => (
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
                {...props}
              />
            )}
          />
        )}
      </>
    );
  },
);

export default TextBlock;
