import React, { useState } from 'react';
import useEventHandlers from '@Components/UI/RenderHooks/useEventHandlers';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import { selectIsPrototypeMode } from '@Redux/user/selectors';
import { selectExportScreenFlag } from '@Redux/project/selectors/base';
import { useHistory } from 'react-router';
import { makeComponentStyles } from '../styles';
import { RendererProps } from '../types';

const useStyles = makeComponentStyles('checkbox', {});

const UnstyledCheckbox = React.forwardRef<HTMLInputElement, RendererProps>(
  (props, ref) => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const { element, isDisabled } = props;
    const { id, styles } = element;
    const [className, groupClass] = styles.classNames;
    const eventHandlers = useEventHandlers(props, {
      onChange: () => {
        if (!isDisabled) {
          setIsChecked(!isChecked);
        }
      },
    });
    const { isLink, link, screenLink, screenName } = element.parameters;
    const history = useHistory();
    const isProtoMode = useSelector(selectIsPrototypeMode);
    const exportScreenFlag = useSelector(selectExportScreenFlag);
    const changeScreen = () => {
      history.push(`/project/${screenLink}`);
    };

    const classes = useStyles(props);

    return (
      <div
        ref={ref}
        id={id}
        {...eventHandlers}
        data-ls-id={id}
        className={cn(
          className,
          groupClass,
          classes.ownStyles,
          isDisabled ? classes.disabled : classes.ownPseudoStyles,
        )}
        style={{ width: 'fit-content' }}
      >
        <label>
          {!isDisabled && isChecked ? (
            <input type="checkbox" name="Checkbox" checked />
          ) : (
            <input type="checkbox" name="Checkbox" disabled={isDisabled} />
          )}

          {isLink && (isProtoMode || exportScreenFlag) ? (
            <a
              aria-label={`Link-${element.id}`}
              target={exportScreenFlag ? '_self' : '_blank'}
              href={link}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              rel="noreferrer"
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
            />
          ) : screenLink && screenName && isProtoMode && !exportScreenFlag ? (
            <label
              ref={
                ref as unknown as React.MutableRefObject<HTMLLabelElement | null>
              }
              id={id}
              role="presentation"
              onClick={() =>
                isProtoMode && !exportScreenFlag ? changeScreen() : ''
              }
              style={{ cursor: 'pointer' }}
              data-ls-id={id}
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
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
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              rel="noreferrer"
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
            />
          ) : (
            <label
              ref={
                ref as unknown as React.MutableRefObject<HTMLLabelElement | null>
              }
              id={id}
              data-ls-id={id}
              dangerouslySetInnerHTML={{ __html: element.parameters.value }}
            />
          )}
        </label>
      </div>
    );
  },
);

export default UnstyledCheckbox;
