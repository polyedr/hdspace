import React, { LegacyRef } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { useHistory } from '@/compat/router';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { RendererProps } from '../types';
import useEventHandlers from '../../RenderHooks/useEventHandlers';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('label', {
  label: {
    wordBreak: 'break-word',
    cursor: 'default',
    outline: 0,
  },
});

const Label = React.forwardRef<HTMLLabelElement, RendererProps>(
  (props, ref) => {
    const { element, isDisabled } = props;
    const [className, groupClass] = element.styles.classNames;
    const { labelFor, textContent, isLink, link, screenLink, screenName } =
      element.parameters;
    const styles = useStyles(props);
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
            ref={ref as unknown as LegacyRef<HTMLAnchorElement>}
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <label
              id={element.id}
              ref={ref as LegacyRef<HTMLLabelElement>}
              data-ls-id={element.id}
              className={cn(
                className,
                styles.label,
                groupClass,
                styles.ownStyles,
                !isDisabled && styles.ownPseudoStyles,
              )}
              {...(labelFor !== 'no for attribute' && { htmlFor: labelFor })}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...eventHandlers}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <label
            id={element.id}
            ref={ref as LegacyRef<HTMLLabelElement>}
            onClick={() =>
              isProtoMode && !exportScreenFlag ? changeScreen() : ''
            }
            role="presentation"
            {...(labelFor !== 'no for attribute' && { htmlFor: labelFor })}
            data-ls-id={element.id}
            className={cn(
              className,
              styles.label,
              groupClass,
              styles.ownStyles,
              !isDisabled && styles.ownPseudoStyles,
            )}
            dangerouslySetInnerHTML={{ __html: textContent }}
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
            <label
              ref={ref as LegacyRef<HTMLLabelElement>}
              id={element.id}
              data-ls-id={element.id}
              {...(labelFor !== 'no for attribute' && { htmlFor: labelFor })}
              className={cn(
                className,
                styles.label,
                groupClass,
                styles.ownStyles,
                !isDisabled && styles.ownPseudoStyles,
              )}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...eventHandlers}
            />
          </a>
        ) : (
          <label
            ref={ref as LegacyRef<HTMLLabelElement>}
            id={element.id}
            data-ls-id={element.id}
            {...(labelFor !== 'no for attribute' && { htmlFor: labelFor })}
            className={cn(
              className,
              styles.label,
              groupClass,
              styles.ownStyles,
              !isDisabled && styles.ownPseudoStyles,
            )}
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...eventHandlers}
          />
        )}
      </>
    );
  },
);

export default Label;
