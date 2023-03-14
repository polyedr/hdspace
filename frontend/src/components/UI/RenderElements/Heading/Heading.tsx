import React from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import InlineEditable from '@Components/UI/InlineEditable';
import { useElement } from '@Src/hooks';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('heading');

const Heading = React.forwardRef<HTMLHeadingElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { headingType, textContent, isLink, link, screenLink, screenName } =
      element.parameters;
    const HeadingTag = headingType || 'h3';

    const { updateParams } = useElement(element.id);

    const styles = useStyles(props);
    const eventHandlers = useEventHandlers(props);
    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);

    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

    const handleUpdatedHeading = (text: string) => {
      updateParams({
        textContent: text,
      });
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
          >
            <InlineEditable
              elementId={element.id}
              text={textContent}
              onUpdated={handleUpdatedHeading}
              renderElement={(text, props) => (
                <HeadingTag
                  ref={ref}
                  id={element.id}
                  data-ls-id={element.id}
                  className={cn(
                    className,
                    groupClass,
                    styles.ownStyles,
                    !isDisabled && styles.ownPseudoStyles,
                  )}
                  dangerouslySetInnerHTML={{ __html: text }}
                  data-gramm_editor={false}
                  {...eventHandlers}
                  {...props}
                />
              )}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <InlineEditable
            elementId={element.id}
            onUpdated={handleUpdatedHeading}
            text={textContent}
            renderElement={(text, props) => (
              <HeadingTag
                ref={ref}
                id={element.id}
                data-ls-id={element.id}
                onClick={() =>
                  isProtoMode && !exportScreenFlag ? changeScreen() : ''
                }
                className={cn(
                  className,
                  groupClass,
                  styles.ownStyles,
                  !isDisabled && styles.ownPseudoStyles,
                )}
                dangerouslySetInnerHTML={{ __html: text }}
                data-gramm_editor={false}
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
          >
            <InlineEditable
              elementId={element.id}
              text={textContent}
              onUpdated={handleUpdatedHeading}
              renderElement={(text, props) => (
                <HeadingTag
                  ref={ref}
                  id={element.id}
                  data-ls-id={element.id}
                  className={cn(
                    className,
                    groupClass,
                    styles.ownStyles,
                    !isDisabled && styles.ownPseudoStyles,
                  )}
                  dangerouslySetInnerHTML={{ __html: text }}
                  data-gramm_editor={false}
                  {...eventHandlers}
                  {...props}
                />
              )}
            />
          </a>
        ) : (
          <InlineEditable
            elementId={element.id}
            text={textContent}
            onUpdated={handleUpdatedHeading}
            renderElement={(text, props) => (
              <HeadingTag
                ref={ref}
                id={element.id}
                data-ls-id={element.id}
                className={cn(
                  className,
                  groupClass,
                  styles.ownStyles,
                  !isDisabled && styles.ownPseudoStyles,
                )}
                dangerouslySetInnerHTML={{ __html: text }}
                data-gramm_editor={false}
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

export default Heading;
