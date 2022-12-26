import React from 'react';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
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

    const contentEditableSettings = useContentEditable(element.id, textContent);
    const styles = useStyles(props);
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
            style={{ textDecoration: 'none' }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
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
              dangerouslySetInnerHTML={{ __html: textContent }}
              data-gramm_editor={false}
              {...eventHandlers}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
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
            dangerouslySetInnerHTML={{ __html: textContent }}
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
              dangerouslySetInnerHTML={{ __html: textContent }}
              data-gramm_editor={false}
              {...eventHandlers}
            />
          </a>
        ) : (
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

export default Heading;
