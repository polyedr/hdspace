import React, { memo } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import useContentEditable from '@Components/UI/RenderHooks/useContentEditable';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
import { RendererProps } from '../types';
import { makeComponentStyles } from '../styles';

const useStyles = makeComponentStyles('button', {});

const ChildrenButton = React.forwardRef<HTMLDivElement, RendererProps>(
  (props, ref) => {
    const classes = useStyles(props);
    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);
    const { element, isDisabled } = props;
    const {
      id,
      parameters: { textContent, isLink, link, screenLink, screenName },
      styles,
    } = element;

    const [className, groupClass] = styles.classNames;
    const contentEditableSettings = useContentEditable(id, textContent);
    const eventHandlers = useEventHandlers(
      props,
      contentEditableSettings.events,
    );

    const mainClasses = cn(
      props.style,
      className,
      groupClass,
      isDisabled ? classes.disabled : classes.ownPseudoStyles,
    );

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
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <button
              type="button"
              id={id}
              ref={ref as React.MutableRefObject<HTMLButtonElement | null>}
              data-ls-id={id}
              style={{ width: '100%' }}
              className={cn(mainClasses, classes.ownStyles)}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...eventHandlers}
            />
          </a>
        ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
          <button
            type="button"
            id={id}
            onClick={() =>
              isProtoMode && !exportScreenFlag ? changeScreen() : ''
            }
            ref={ref as React.MutableRefObject<HTMLButtonElement | null>}
            data-ls-id={id}
            className={cn(mainClasses, classes.ownStyles)}
            dangerouslySetInnerHTML={{ __html: textContent }}
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
            rel="noreferrer"
            {...contentEditableSettings.props}
            {...contentEditableSettings.events}
          >
            <button
              type="button"
              id={id}
              ref={ref as React.MutableRefObject<HTMLButtonElement | null>}
              data-ls-id={id}
              className={cn(mainClasses, classes.ownStyles)}
              dangerouslySetInnerHTML={{ __html: textContent }}
              {...eventHandlers}
            />
          </a>
        ) : (
          <button
            type="button"
            id={id}
            ref={ref as React.MutableRefObject<HTMLButtonElement | null>}
            data-ls-id={id}
            className={cn(mainClasses, classes.ownStyles)}
            dangerouslySetInnerHTML={{ __html: textContent }}
            {...eventHandlers}
          />
        )}
      </>
    );
  },
);

export default memo(ChildrenButton);
